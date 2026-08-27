// js/forge-ui.js — UI кузницы
Sherwood.ForgeUI = {
    show: function() {
        var gb = SherwoodUI._previousScreen === 'profile' ? 'Sherwood.ProfileUI.show()' : 'SherwoodUI.loadHome()';
        SherwoodUI._previousScreen = null;
        SherwoodUI._playSound('click');
        
        if (!Sherwood.Forge) { SherwoodUI._showPlaceholder('Кузница', 'forge', gb); return; }
        
        var player = Sherwood.getPlayer();
        var resources = Sherwood.Bag ? Sherwood.Bag.getResources() : {};
        var skinDrawings = resources.skinTablets || 0;
        var ringTablets = resources.ringTablets || 0;
        var amuletTablets = resources.amuletTablets || 0;
        var arrowCount = Sherwood.Forge.getArrowCount ? Sherwood.Forge.getArrowCount() : 0;
        
        var h = '';
        
        h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">';
        h += '<div onclick="Sherwood.ForgeUI._showSkinCrafting()" style="cursor:pointer;position:relative;width:70px;height:70px;background:url(\'assets/interface/bag_cell.png\') center/contain no-repeat;background-size:cover;border:2px solid #c9a040;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><img src="assets/interface/skin_drawing.png" style="width:44px;height:44px;object-fit:contain;"><span style="position:absolute;bottom:2px;right:4px;color:#fff;font-size:0.6em;font-weight:bold;background:rgba(0,0,0,0.8);padding:1px 6px;border-radius:4px;">' + skinDrawings + '</span></div>';
        h += '<div onclick="Sherwood.ForgeUI._showRingCrafting()" style="cursor:pointer;position:relative;width:70px;height:70px;background:url(\'assets/interface/bag_cell.png\') center/contain no-repeat;background-size:cover;border:2px solid #c9a040;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><img src="assets/interface/ring_crafting_tablet_resource.png" style="width:44px;height:44px;object-fit:contain;"><span style="position:absolute;bottom:2px;right:4px;color:#fff;font-size:0.6em;font-weight:bold;background:rgba(0,0,0,0.8);padding:1px 6px;border-radius:4px;">' + ringTablets + '</span></div>';
        h += '<div onclick="Sherwood.ForgeUI._showAmuletCrafting()" style="cursor:pointer;position:relative;width:70px;height:70px;background:url(\'assets/interface/bag_cell.png\') center/contain no-repeat;background-size:cover;border:2px solid #c9a040;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><img src="assets/interface/amulet_crafting_tablet_resource.png" style="width:44px;height:44px;object-fit:contain;"><span style="position:absolute;bottom:2px;right:4px;color:#fff;font-size:0.6em;font-weight:bold;background:rgba(0,0,0,0.8);padding:1px 6px;border-radius:4px;">' + amuletTablets + '</span></div>';
        h += '<div onclick="Sherwood.ForgeUI._craftArrow()" style="cursor:pointer;position:relative;width:70px;height:70px;background:url(\'assets/interface/bag_cell.png\') center/contain no-repeat;background-size:cover;border:2px solid #c9a040;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><img src="assets/interface/sherwood_hollow_arrow.png" style="width:44px;height:44px;object-fit:contain;" onerror="this.src=\'assets/interface/labyrinth_of_icons.png\'"><span style="position:absolute;bottom:2px;right:4px;color:#fff;font-size:0.6em;font-weight:bold;background:rgba(0,0,0,0.8);padding:1px 6px;border-radius:4px;">' + arrowCount + '</span></div>';
        h += '</div>';
        
        var ring = Sherwood.Bag && Sherwood.Bag._equipment ? Sherwood.Bag._equipment.ring : null;
        var amulet = Sherwood.Bag && Sherwood.Bag._equipment ? Sherwood.Bag._equipment.amulet : null;
        var ringLevel = Sherwood.Forge.getEnhanceLevel('ring');
        var ringCost = Sherwood.Forge.getEnhanceCost('ring');
        var amuletLevel = Sherwood.Forge.getEnhanceLevel('amulet');
        var amuletCost = Sherwood.Forge.getEnhanceCost('amulet');
        var skinLevel = Sherwood.Forge.getEnhanceLevel('skin');
        var skinCost = Sherwood.Forge.getEnhanceCost('skin');
        
        h += '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;align-items:center;width:100%;">';
        
        if (ring) {
            h += '<button onclick="Sherwood.ForgeUI._enhanceEquipped(\'ring\')" style="background:#c9a040;border:none;border-radius:8px;padding:12px 20px;color:#000;font-weight:bold;cursor:pointer;font-size:0.85em;width:80%;max-width:300px;">Заточить кольцо (+' + ringLevel + ') — ' + ringCost + ' сер.</button>';
        } else {
            h += '<div style="background:rgba(0,0,0,0.5);border:1px solid #555;border-radius:8px;padding:12px 20px;color:#888;font-size:0.85em;width:80%;max-width:300px;text-align:center;">Нет кольца</div>';
        }
        
        if (amulet) {
            h += '<button onclick="Sherwood.ForgeUI._enhanceEquipped(\'amulet\')" style="background:#c9a040;border:none;border-radius:8px;padding:12px 20px;color:#000;font-weight:bold;cursor:pointer;font-size:0.85em;width:80%;max-width:300px;">Заточить амулет (+' + amuletLevel + ') — ' + amuletCost + ' сер.</button>';
        } else {
            h += '<div style="background:rgba(0,0,0,0.5);border:1px solid #555;border-radius:8px;padding:12px 20px;color:#888;font-size:0.85em;width:80%;max-width:300px;text-align:center;">Нет амулета</div>';
        }
        
        h += '<button onclick="Sherwood.ForgeUI._enhanceEquipped(\'skin\')" style="background:#c9a040;border:none;border-radius:8px;padding:12px 20px;color:#000;font-weight:bold;cursor:pointer;font-size:0.85em;width:80%;max-width:300px;">Заточить скин (+' + skinLevel + ') — ' + skinCost + ' сер.</button>';
        h += '</div>';
        
        var items = Sherwood.Bag ? Sherwood.Bag.getItems() : [];
        var enhanceItems = items.filter(function(i) { return i.part && i.part !== 'ring' && i.part !== 'amulet'; });
        
        if (enhanceItems.length > 0) {
            for (var i = 0; i < enhanceItems.length; i++) {
                var item = enhanceItems[i], idx = items.indexOf(item), lvl = item.enhancement || 0;
                h += '<div style="background:rgba(0,0,0,0.5);border:1px solid #555;border-radius:6px;padding:8px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">';
                h += '<div><div style="color:#e0c080;font-size:0.8em;">' + item.name + '</div><div style="color:#aaa;font-size:0.6em;">Заточка: +' + lvl + '</div></div>';
                h += '<button onclick="Sherwood.ForgeUI._enhanceItem(' + idx + ')" style="background:#c9a040;border:none;border-radius:4px;padding:4px 10px;color:#000;cursor:pointer;font-size:0.7em;">Точить</button>';
                h += '</div>';
            }
        }
        
        h += '<div id="forge-info" style="text-align:center;color:#e0c080;font-size:0.8em;font-weight:bold;margin-top:12px;min-height:24px;"></div>';
        
        SherwoodUI._openScreenScrollable('Кузница', 'forge', h, gb);
    },

    _showSkinCrafting: function() {
        var skins = Sherwood.Forge.getCraftSkins();
        var player = Sherwood.getPlayer();
        var unlocked = player.unlockedSkins || [];
        var resources = Sherwood.Bag.getResources();
        var skinDrawings = resources.skinTablets || 0;
        
        var h = '<div style="text-align:center;color:#e0c080;font-size:1.1em;font-weight:bold;margin-bottom:12px;">Создание обликов</div>';
        h += '<div style="color:#aaa;font-size:0.7em;margin-bottom:8px;">Чертежей: ' + skinDrawings + '</div>';
        h += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';
        
        for (var i = 0; i < skins.length; i++) {
            var skin = skins[i];
            var owned = unlocked.indexOf(skin.id) !== -1;
            
            h += '<div style="background:rgba(0,0,0,0.5);border:2px solid ' + (owned ? '#4caf50' : '#555') + ';border-radius:8px;padding:12px;width:80%;text-align:center;">';
            h += '<img src="' + skin.icon + '" style="width:64px;height:64px;object-fit:contain;border-radius:4px;" onerror="this.src=\'assets/hero_skins/skin1_01.png\'">';
            h += '<div style="color:#e0c080;font-size:0.8em;font-weight:bold;margin-top:4px;">' + skin.name + '</div>';
            
            if (owned) {
                h += '<div style="color:#4caf50;font-size:0.7em;font-weight:bold;margin-top:4px;">ВЫКОВАН</div>';
            } else {
                h += '<div style="color:#aaa;font-size:0.65em;margin-top:4px;">Чертежей: ' + skin.cost.drawings + ' | Скрижалей: ' + skin.cost.tablets + '</div>';
                h += '<button onclick="Sherwood.ForgeUI._craftSkin(\'' + skin.id + '\')" style="margin-top:4px;background:#c9a040;border:none;border-radius:4px;padding:6px 16px;color:#000;cursor:pointer;font-size:0.7em;font-weight:bold;">Создать</button>';
            }
            h += '</div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreenScrollable('Облики', 'forge', h, 'Sherwood.ForgeUI.show()');
    },

    _showRingCrafting: function() {
        var rings = Sherwood.BlackMarket.getAvailableRings();
        var player = Sherwood.getPlayer();
        var resources = Sherwood.Bag.getResources();
        var ringTablets = resources.ringTablets || 0;
        var ownedRings = player.marketData && player.marketData.ownedJewelry ? player.marketData.ownedJewelry.rings : [];
        
        var h = '<div style="text-align:center;color:#e0c080;font-size:1.1em;font-weight:bold;margin-bottom:12px;">Ковка колец</div>';
        h += '<div style="color:#aaa;font-size:0.7em;margin-bottom:8px;">Скрижалей: ' + ringTablets + '</div>';
        h += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';
        
        for (var i = 0; i < rings.length; i++) {
            var ring = rings[i];
            var owned = ownedRings.indexOf(ring.id) !== -1 || Sherwood.BlackMarket.isJewelryOwned('ring', ring.id);
            
            h += '<div style="background:rgba(0,0,0,0.5);border:2px solid ' + (owned ? '#4caf50' : '#555') + ';border-radius:8px;padding:12px;width:80%;text-align:center;">';
            h += '<img src="' + ring.icon + '" style="width:64px;height:64px;object-fit:contain;border-radius:4px;">';
            h += '<div style="color:#e0c080;font-size:0.8em;font-weight:bold;margin-top:4px;">' + ring.name + '</div>';
            h += '<div style="color:#aaa;font-size:0.65em;margin-top:2px;">АТК +' + ring.stats.attack + ' | ЗЩТ +' + ring.stats.defense + '</div>';
            
            if (owned) {
                h += '<div style="color:#4caf50;font-size:0.7em;font-weight:bold;margin-top:4px;">ВЫКОВАН</div>';
            } else {
                h += '<div style="color:#aaa;font-size:0.65em;margin-top:4px;">Скрижалей: 10</div>';
                h += '<button onclick="Sherwood.ForgeUI._buyRing(\'' + ring.id + '\')" style="margin-top:4px;background:#c9a040;border:none;border-radius:4px;padding:6px 16px;color:#000;cursor:pointer;font-size:0.7em;font-weight:bold;">Создать</button>';
            }
            h += '</div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreenScrollable('Кольца', 'forge', h, 'Sherwood.ForgeUI.show()');
    },

    _showAmuletCrafting: function() {
        var amulets = Sherwood.BlackMarket.getAvailableAmulets();
        var player = Sherwood.getPlayer();
        var resources = Sherwood.Bag.getResources();
        var amuletTablets = resources.amuletTablets || 0;
        var ownedAmulets = player.marketData && player.marketData.ownedJewelry ? player.marketData.ownedJewelry.amulets : [];
        
        var h = '<div style="text-align:center;color:#e0c080;font-size:1.1em;font-weight:bold;margin-bottom:12px;">Ковка амулетов</div>';
        h += '<div style="color:#aaa;font-size:0.7em;margin-bottom:8px;">Скрижалей: ' + amuletTablets + '</div>';
        h += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';
        
        for (var i = 0; i < amulets.length; i++) {
            var amulet = amulets[i];
            var owned = ownedAmulets.indexOf(amulet.id) !== -1 || Sherwood.BlackMarket.isJewelryOwned('amulet', amulet.id);
            
            h += '<div style="background:rgba(0,0,0,0.5);border:2px solid ' + (owned ? '#4caf50' : '#555') + ';border-radius:8px;padding:12px;width:80%;text-align:center;">';
            h += '<img src="' + amulet.icon + '" style="width:64px;height:64px;object-fit:contain;border-radius:4px;">';
            h += '<div style="color:#e0c080;font-size:0.8em;font-weight:bold;margin-top:4px;">' + amulet.name + '</div>';
            h += '<div style="color:#aaa;font-size:0.65em;margin-top:2px;">HP +' + amulet.stats.hp + ' | ЗЩТ +' + amulet.stats.defense + '</div>';
            
            if (owned) {
                h += '<div style="color:#4caf50;font-size:0.7em;font-weight:bold;margin-top:4px;">ВЫКОВАН</div>';
            } else {
                h += '<div style="color:#aaa;font-size:0.65em;margin-top:4px;">Скрижалей: 10</div>';
                h += '<button onclick="Sherwood.ForgeUI._buyAmulet(\'' + amulet.id + '\')" style="margin-top:4px;background:#c9a040;border:none;border-radius:4px;padding:6px 16px;color:#000;cursor:pointer;font-size:0.7em;font-weight:bold;">Создать</button>';
            }
            h += '</div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreenScrollable('Амулеты', 'forge', h, 'Sherwood.ForgeUI.show()');
    },

    _craftArrow: function() {
        var arrowInfo = Sherwood.Forge.getArrowCraftInfo();
        var info = document.getElementById('forge-info');
        
        if (arrowInfo.canCraft > 0) {
            var r = Sherwood.Forge.craftArrowBatch(1);
            if (r.success) {
                if (info) info.textContent = 'Создано стрел: ' + (r.crafted || 1);
            } else {
                if (info) info.textContent = r.reason || 'Ошибка';
            }
        } else {
            if (info) info.textContent = 'Не хватает: 1 Ветка + 1 Перо + 1 Кость';
        }
        
        var self = this;
        setTimeout(function() { self.show(); }, 800);
    },

    _buyRing: function(ringId) {
        var r = Sherwood.BlackMarket.buyJewelry('ring', ringId);
        if (r.success) { SherwoodUI._showToast('Кольцо выковано!'); }
        else { SherwoodUI._showToast(r.reason || 'Ошибка'); }
        var self = this;
        setTimeout(function() { self._showRingCrafting(); }, 800);
    },

    _buyAmulet: function(amuletId) {
        var r = Sherwood.BlackMarket.buyJewelry('amulet', amuletId);
        if (r.success) { SherwoodUI._showToast('Амулет выкован!'); }
        else { SherwoodUI._showToast(r.reason || 'Ошибка'); }
        var self = this;
        setTimeout(function() { self._showAmuletCrafting(); }, 800);
    },

    _craftSkin: function(skinId) {
        var r = Sherwood.Forge.craftSkin(skinId);
        if (r.success) { SherwoodUI._showToast('Облик выкован!'); }
        else { SherwoodUI._showToast(r.reason || 'Ошибка'); }
        var self = this;
        setTimeout(function() { self._showSkinCrafting(); }, 800);
    },

    _enhanceItem: function(idx) {
        var r = Sherwood.Forge.enhanceItem(idx);
        var log = document.getElementById('forge-log');
        
        if (r.enhanced) { if (log) log.textContent = 'Улучшено! +' + r.newLevel; }
        else if (r.broken) { if (log) log.textContent = 'Сломано!'; }
        else if (r.failed) { if (log) log.textContent = 'Неудача'; }
        else { if (log) log.textContent = (r.reason || 'Ошибка'); }
        
        SherwoodUI.updateDisplay();
        var self = this;
        setTimeout(function() { self.show(); }, 800);
    },

    _enhanceEquipped: function(type) {
        var r = Sherwood.Forge.enhanceEquipped(type);
        if (r.success) {
            SherwoodUI._playSound('forge');
            SherwoodUI._showToast('Улучшено!');
            SherwoodUI.updateDisplay();
            this.show();
        } else {
            SherwoodUI._showToast(r.reason || 'Ошибка');
        }
    }
};
