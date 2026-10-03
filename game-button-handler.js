(function(){
  function safeCall(fn, ...args){
    if (typeof fn === 'function') return fn(...args);
    return undefined;
  }

  function getSceneEmoji(sceneId){
    const map = {
      school: '🏫',
      college: '🎓',
      training: '📚',
      class: '🧑‍🏫',
      home: '🏠',
      city: '🚗',
      study: '📖',
      lecture: '🎓',
      shop: '🛍️',
      character: '⭐',
      asset: '🏡',
      world: '🌍'
    };
    return map[sceneId] || '🎮';
  }

  function defaultSceneBody(title, desc, okText, okAction){
    return `
      <h2>${title}</h2>
      <p>${desc}</p>
      <div class="sceneActions">
        <button class="btn primary" type="button">${okText}</button>
        <button class="btn secondary" type="button">Close</button>
      </div>
    `;
  }

  function applySceneUi(btn, title, content, emoji){
    if (typeof window.showActiveScene === 'function') {
      window.showActiveScene(title, content, emoji);
      return;
    }

    const scene = document.getElementById('activeScene');
    const backdrop = document.getElementById('sceneBackdrop');
    if (!scene || !backdrop) return;
    const art = document.getElementById('activeSceneArt');
    const heading = document.getElementById('activeSceneTitle');
    const body = document.getElementById('activeSceneContent');
    if (art) art.textContent = emoji;
    if (heading) heading.textContent = title;
    if (body) body.innerHTML = content;
    scene.classList.remove('hidden');
    backdrop.classList.add('active');
  }

  function bindGenericButton(btn){
    if (!btn || btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    btn.onclick = null;

    const sceneId = btn.dataset.scene;
    const lifeId = btn.dataset.life;
    const actionId = btn.dataset.action;
    const filterVal = btn.dataset.filter;
    const lookVal = btn.dataset.look;
    const buyId = btn.dataset.buy;
    const useId = btn.dataset.use;
    const assetId = btn.dataset.a;
    const missionIndex = btn.dataset.m;

    if (btn.classList.contains('sceneBack') || btn.id === 'sceneBackdrop') {
      btn.onclick = () => safeCall(window.closeActiveScene);
      return;
    }

    if (sceneId) {
      btn.onclick = () => {
        const label = (sceneId.charAt(0).toUpperCase() + sceneId.slice(1)).replace(/-/g, ' ');
        const emoji = getSceneEmoji(sceneId);
        const content = `
          <h2>${emoji} ${label} Scene</h2>
          <p>You are now inside the ${label.toLowerCase()} area. Choose what to do next.</p>
          <div class="sceneActions">
            <button class="btn primary" type="button" onclick="if(typeof window.lifeAction==='function')window.lifeAction('${sceneId}'); if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Play</button>
            <button class="btn secondary" type="button" onclick="if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Leave</button>
          </div>
        `;
        applySceneUi(btn, `🌍 ${label} Scene`, content, emoji);
      };
      return;
    }

    if (lifeId) {
      btn.onclick = () => {
        safeCall(window.lifeAction, lifeId);
        const label = (lifeId.charAt(0).toUpperCase() + lifeId.slice(1)).replace(/-/g, ' ');
        const emoji = getSceneEmoji(lifeId);
        const content = `
          <h2>${emoji} ${label}</h2>
          <p>Complete this activity to improve your life journey and make progress toward your dream career.</p>
          <div class="sceneActions">
            <button class="btn primary" type="button" onclick="if(typeof window.lifeAction==='function')window.lifeAction('${lifeId}'); if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Continue</button>
            <button class="btn secondary" type="button" onclick="if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Close</button>
          </div>
        `;
        applySceneUi(btn, `🎯 ${label}`, content, emoji);
      };
      return;
    }

    if (actionId) {
      btn.onclick = () => {
        safeCall(window.sceneAction, actionId);
        const label = (actionId.charAt(0).toUpperCase() + actionId.slice(1)).replace(/-/g, ' ');
        const emoji = getSceneEmoji(actionId);
        const content = `
          <h2>${emoji} ${label}</h2>
          <p>This action is part of your journey. Use it to earn rewards, progress, and experience.</p>
          <div class="sceneActions">
            <button class="btn primary" type="button" onclick="if(typeof window.sceneAction==='function')window.sceneAction('${actionId}'); if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Do Action</button>
            <button class="btn secondary" type="button" onclick="if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Cancel</button>
          </div>
        `;
        applySceneUi(btn, `⚡ ${label}`, content, emoji);
      };
      return;
    }

    if (buyId !== undefined) {
      btn.onclick = () => {
        safeCall(window.buyChar, buyId);
        safeCall(window.closeActiveScene);
      };
      return;
    }

    if (useId !== undefined) {
      btn.onclick = () => {
        const id = useId;
        if (typeof window.buyChar === 'function') safeCall(window.buyChar, id);
        else if (typeof window.chooseCharacter === 'function') safeCall(window.chooseCharacter, id);
        safeCall(window.closeActiveScene);
      };
      return;
    }

    if (assetId !== undefined) {
      btn.onclick = () => {
        safeCall(window.buyAsset, assetId);
        safeCall(window.closeActiveScene);
      };
      return;
    }

    if (missionIndex !== undefined) {
      btn.onclick = () => {
        if (typeof window.mission === 'function') safeCall(window.mission, Number(missionIndex));
        safeCall(window.closeActiveScene);
      };
      return;
    }

    if (filterVal !== undefined) {
      btn.onclick = () => {
        if (typeof window.renderChars === 'function') safeCall(window.renderChars, filterVal);
      };
      return;
    }

    if (lookVal !== undefined) {
      btn.onclick = () => {
        if (window.s && window.s[lookVal.split(':')[0]] !== undefined) {
          const [key, value] = lookVal.split(':');
          window.s[key] = value;
          safeCall(window.save);
          safeCall(window.renderCustom);
          safeCall(window.render);
        }
      };
      return;
    }

    if (btn.id === 'sceneBackdrop') {
      btn.onclick = () => safeCall(window.closeActiveScene);
    }
  }

  function bindAllButtons(){
    document.querySelectorAll('button, [data-scene], [data-life], [data-action], [data-filter], [data-look], [data-buy], [data-use], [data-a], [data-m]').forEach((element) => {
      bindGenericButton(element);
    });

    document.querySelectorAll('.world-card').forEach((card) => {
      card.tabIndex = 0;
      card.style.cursor = 'pointer';
      card.onclick = () => {
        const sceneId = card.dataset.scene;
        if (!sceneId) return;
        const emoji = getSceneEmoji(sceneId);
        const label = (sceneId.charAt(0).toUpperCase() + sceneId.slice(1)).replace(/-/g, ' ');
        const content = `
          <h2>${emoji} ${label}</h2>
          <p>Open this world area and continue your teacher journey.</p>
          <div class="sceneActions">
            <button class="btn primary" type="button" onclick="if(typeof window.lifeAction==='function')window.lifeAction('${sceneId}'); if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Enter</button>
            <button class="btn secondary" type="button" onclick="if(typeof window.closeActiveScene==='function')window.closeActiveScene();">Back</button>
          </div>
        `;
        applySceneUi(card, `🌍 ${label} Scene`, content, emoji);
      };
      card.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      };
    });

    const backdrop = document.getElementById('sceneBackdrop');
    if (backdrop) {
      backdrop.onclick = () => safeCall(window.closeActiveScene);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAllButtons, { once: true });
  } else {
    bindAllButtons();
  }
})();
