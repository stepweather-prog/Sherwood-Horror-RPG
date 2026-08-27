// js/training-ui.js — UI тренировки
Sherwood.TrainingUI = {
    show: function() {
        var gb = SherwoodUI._previousScreen === 'profile' ? 'Sherwood.ProfileUI.show()' : 'SherwoodUI.loadHome()';
        SherwoodUI._previousScreen = null;
        SherwoodUI._playSound('click');
        
        var p = Sherwood.getPlayer();
        if (!p.trainingLevels) p.trainingLevels = { attack: 0, defense: 0, hp: 0 };
        var tl = p.trainingLevels;
        
        var stats = ['attack', 'defense', 'hp'];
        var names = { attack: 'Атака', defense: 'Защита', hp: 'Здоровье' };
        var colors = { attack: '#f44336', defense: '#2196f3', hp: '#4caf50' };
        var bonuses = { attack: 3, defense: 3, hp: 3 };
        
        var h = '<div style="padding:10px;display:flex;flex-direction:column;gap:10px;">';
        
        for (var i = 0; i < stats.length; i++) {
            var s = stats[i];
            var lvl = tl[s] || 0;
            var nextLevel = lvl + 1;
            var isGoldLevel = nextLevel % 5 === 0;
            var cost;
            
            if (isGoldLevel) {
                cost = Math.round(5 * Math.pow(1.15, Math.floor(nextLevel / 5)));
            } else {
                cost = Math.round(10 * Math.pow(nextLevel, 1.15));
            }
            
            var currency = isGoldLevel ? 'золота' : 'серебра';
            var currencyIcon = isGoldLevel ? 'assets/interface/resource_gold.png' : 'assets/interface/resource_silver.png';
            
            h += '<div style="background:rgba(0,0,0,0.5);border:1px solid #555;border-radius:10px;padding:12px;display:flex;flex-direction:column;align-items:center;">';
            h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">';
            h += '<img src="' + SherwoodUI._statIcons[s] + '" style="width:64px;height:64px;object-fit:contain;">';
            h += '<div style="text-align:left;">';
            h += '<div style="color:#e0c080;font-size:1em;font-weight:bold;">' + names[s] + '</div>';
            h += '<div style="color:#aaa;font-size:0.8em;">Уровень: ' + lvl + '/1000</div>';
            h += '<div style="color:' + colors[s] + ';font-size:0.7em;">+' + bonuses[s] + ' за уровень</div>';
            h += '</div></div>';
            
            h += '<div style="color:#e0c080;font-size:0.75em;margin-bottom:6px;">Следующая тренировка: <img src="' + currencyIcon + '" style="width:16px;height:16px;vertical-align:middle;"> ' + cost + ' ' + currency + '</div>';
            
            if (lvl >= 1000) {
                h += '<div style="color:#4caf50;font-weight:bold;">МАКСИМУМ</div>';
            } else {
                h += '<button onclick="Sherwood.TrainingUI._train(\'' + s + '\')" style="background:#c9a040;border:none;border-radius:6px;padding:10px 24px;color:#000;font-weight:bold;cursor:pointer;font-size:0.9em;">Тренировать</button>';
            }
            
            h += '</div>';
        }
        
        h += '<div id="training-log" style="text-align:center;color:#aaa;font-size:0.7em;margin-top:8px;"></div></div>';
        
        SherwoodUI._openScreenScrollable('Тренировка', 'training', h, gb);
    },

    _train: function(stat) {
        var p = Sherwood.getPlayer();
        if (!p) return;
        if (!p.trainingLevels) p.trainingLevels = { attack: 0, defense: 0, hp: 0 };
        
        var cur = p.trainingLevels[stat] || 0;
        
        if (cur >= 1000) {
            var log = document.getElementById('training-log');
            if (log) log.textContent = 'Макс. уровень!';
            return;
        }
        
        var nextLevel = cur + 1;
        var isGoldLevel = nextLevel % 5 === 0;
        var cost;
        
        if (isGoldLevel) {
            cost = Math.round(5 * Math.pow(1.15, Math.floor(nextLevel / 5)));
        } else {
            cost = Math.round(10 * Math.pow(nextLevel, 1.15));
        }
        
        var currency = isGoldLevel ? 'gold' : 'silver';
        var currencyName = isGoldLevel ? 'золота' : 'серебра';
        
        if ((p.resources[currency] || 0) < cost) {
            var log = document.getElementById('training-log');
            if (log) log.textContent = 'Нужно ' + cost + ' ' + currencyName + '!';
            return;
        }
        
        p.resources[currency] -= cost;
        p.trainingLevels[stat] = nextLevel;
        
        if (Sherwood.Daily) Sherwood.Daily.updateProgress('stat_' + stat, p.stats[stat]);
        if (Sherwood._recalcStats) Sherwood._recalcStats();
        if (Sherwood.saveGame) Sherwood.saveGame();
        
        SherwoodUI.updateDisplay();
        this.show();
        
        var log = document.getElementById('training-log');
        if (log) log.textContent = stat + ' → ' + nextLevel + ' (-' + cost + ' ' + currencyName + ')';
    }
};
