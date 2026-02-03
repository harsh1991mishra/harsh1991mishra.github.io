// Board Simulator main JS
(function(){
  const loadScript = (src) => new Promise((res, rej)=>{
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });

  function createSimulatorSection(){
    const section = document.createElement('section');
    section.id = 'board-simulator';
    section.className = 'simulator-section';
    section.innerHTML = `
      <div class="container">
        <h2>Board Simulator</h2>
        <p style="color:var(--sim-muted);margin-bottom:1rem">Experiment with virtual Arduino, ESP32, and Raspberry Pi Pico boards directly in the browser.</p>
        <div class="simulator-container">
          <div class="simulator-left">
            <div class="simulator-controls">
              <select id="simBoardSelect" class="simulator-select" aria-label="Select board">
                <option value="arduino">Arduino Uno</option>
                <option value="esp32">ESP32 (simulated)</option>
                <option value="pico">Raspberry Pi Pico</option>
              </select>
              <button id="simRun" class="sim-run">Run</button>
              <button id="simStop" class="sim-run" style="background:#f1f1f1;color:#0b2b1a">Stop</button>
            </div>
            <div class="component-palette">
              <div class="component-item" draggable="true" data-type="led">🔴 LED</div>
              <div class="component-item" draggable="true" data-type="button">🔘 Button</div>
              <div class="component-item" draggable="true" data-type="sensor">📡 Sensor</div>
            </div>
          </div>
          <div class="simulator-canvas-wrap">
            <div class="board-canvas" id="boardCanvas" aria-label="Board canvas">Drop components here</div>
            <div style="margin-top:0.75rem;display:flex;gap:1rem;align-items:flex-start">
              <div style="flex:1">
                <div class="editor-wrap" id="editorWrap"></div>
              </div>
              <div style="width:320px">
                <div style="font-weight:700;margin-bottom:0.5rem">Serial Monitor</div>
                <div class="serial-monitor" id="serialMonitor"></div>
                <div class="sim-footer">Tip: select a board, drop components, write code, then click Run.</div>
              </div>
            </div>
          </div>
          <div class="simulator-right">
            <h4>Connected Components</h4>
            <div id="connectedList" style="display:flex;flex-direction:column;gap:0.5rem"></div>
            <hr style="margin:0.75rem 0">
            <div style="font-size:0.9rem;color:var(--sim-muted)">Examples</div>
            <button id="loadExample" class="sim-run" style="margin-top:0.5rem">Load Blink Example</button>
          </div>
        </div>
      </div>
    `;
    const main = document.querySelector('main') || document.body;
    // insert before footer if present
    const footer = document.querySelector('footer');
    if(footer) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
  }

  // simple serial monitor append
  function serialWrite(msg){
    const el = document.getElementById('serialMonitor');
    if(!el) return;
    const line = document.createElement('div');
    line.textContent = msg;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  // basic component drag/drop
  function setupDragDrop(){
    const palette = document.querySelectorAll('.component-item');
    const canvas = document.getElementById('boardCanvas');
    palette.forEach(it=>{
      it.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', it.dataset.type); });
    });
    canvas.addEventListener('dragover', (e)=>{ e.preventDefault(); });
    canvas.addEventListener('drop', (e)=>{
      e.preventDefault();
      const type = e.dataTransfer.getData('text/plain');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      addComponent(type, x, y);
    });
  }

  const components = [];
  function addComponent(type,x,y){
    const canvas = document.getElementById('boardCanvas');
    const id = 'c'+(components.length+1);
    const el = document.createElement('div');
    el.dataset.id = id;
    el.style.left = `${x-16}px`; el.style.top = `${y-16}px`;
    el.style.position = 'absolute';
    if(type==='led'){
      el.className='virtual-led'; el.style.background='#2b2b2b';
    } else if(type==='button'){
      el.className='virtual-button'; el.textContent='BTN';
    } else {
      el.className='virtual-button'; el.textContent='SEN';
    }
    canvas.appendChild(el);
    components.push({id,type,el});
    refreshConnectedList();
  }

  function refreshConnectedList(){
    const list = document.getElementById('connectedList'); list.innerHTML='';
    components.forEach(c=>{
      const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center';
      row.innerHTML = `<div>${c.type.toUpperCase()} (${c.id})</div><div><button data-id="${c.id}" class="remove-comp" style="background:#fff;border:1px solid var(--sim-border);padding:0.25rem 0.5rem;border-radius:6px">Remove</button></div>`;
      list.appendChild(row);
    });
    list.querySelectorAll('.remove-comp').forEach(b=>b.addEventListener('click', (e)=>{ const id=b.dataset.id; removeComponent(id); }));
  }

  function removeComponent(id){
    const i = components.findIndex(c=>c.id===id); if(i>=0){ components[i].el.remove(); components.splice(i,1); refreshConnectedList(); }
  }

  // Monaco editor loader + simple runner integration
  async function setupEditorAndRunner(){
    // load monaco loader
    if(!window.require){
      await loadScript('https://unpkg.com/monaco-editor@0.39.0/min/vs/loader.js');
    }
    return new Promise((res,rej)=>{
      try{
        require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.39.0/min/vs' } });
        require(['vs/editor/editor.main'], function() {
          const editor = monaco.editor.create(document.getElementById('editorWrap'), {
            value: '# Write code for selected board\n',
            language: 'javascript',
            theme: 'vs-light',
            automaticLayout: true
          });
          window._simulatorEditor = editor;
          res(editor);
        });
      }catch(err){ rej(err); }
    });
  }

  // simple sandboxed JS runner for Arduino (simulated)
  function runJS(code){
    try{
      // provide limited API
      const boardAPI = {
        digitalWrite(pin, val){
          // toggle any LED component by index (1-based)
          const led = components.find(c=>c.type==='led');
          if(led){ led.el.style.background = val ? 'linear-gradient(180deg,#00d988,#00c86b)' : '#2b2b2b'; }
        },
        onButton(cb){
          // attach click to first button
          const btn = components.find(c=>c.type==='button'); if(btn){ btn.el.addEventListener('click', cb); }
        },
        serialWrite: serialWrite
      };
      const fn = new Function('board','serial', code);
      fn(boardAPI, {write:serialWrite});
      serialWrite('[JS] Program executed');
    }catch(err){ serialWrite('[Error] '+err.message); }
  }

  // Pyodide runner for Python code (Pico/ESP32 simulation)
  let pyodideReady=false, pyodide=null;
  async function ensurePyodide(){
    if(pyodideReady) return;
    serialWrite('Loading Python runtime (Pyodide)...');
    await loadScript('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');
    pyodide = await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/'});
    // register a simple JS module 'board' for Python to call
    const board = {
      serial_write: (msg)=>{ serialWrite(msg); }
    };
    pyodide.registerJsModule('board', board);
    pyodideReady = true;
    serialWrite('Pyodide ready');
  }

  async function runPython(code){
    try{
      await ensurePyodide();
      serialWrite('[Python] Running...');
      await pyodide.runPythonAsync(code);
      serialWrite('[Python] Execution finished');
    }catch(err){ serialWrite('[Python Error] '+err.message); }
  }

  function wireUI(){
    document.getElementById('simRun').addEventListener('click', ()=>{
      const board = document.getElementById('simBoardSelect').value;
      const code = window._simulatorEditor ? window._simulatorEditor.getValue() : '';
      serialWrite('Run pressed — board='+board);
      if(board==='arduino'){
        runJS(code);
      } else {
        runPython(code);
      }
    });
    document.getElementById('simStop').addEventListener('click', ()=>{ serialWrite('Stop pressed — terminating runtimes not implemented'); });
    document.getElementById('loadExample').addEventListener('click', ()=>{
      const b = document.getElementById('simBoardSelect').value;
      if(b==='arduino') window._simulatorEditor.setValue("// Arduino-like JS simulation\nboard.digitalWrite(13, 1);\nsetTimeout(()=>board.digitalWrite(13,0), 1000);\nserial.write('Blink example run');");
      else window._simulatorEditor.setValue("# MicroPython example for simulated board\nimport board\nboard.serial_write('Hello from Python')\n");
    });
  }

  async function init(){
    createSimulatorSection();
    setupDragDrop();
    await setupEditorAndRunner();
    wireUI();
    serialWrite('Simulator ready — drag components and run example.');
  }

  // wait for DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
