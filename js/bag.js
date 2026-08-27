// js/bag.js
Sherwood.Bag = {
    _inventory: [],
    _maxSlots: 10,
    _expansionLevel: 0,
    
    _resources: {
        gold: 0,
        silver: 0,
    },

    init: function() {
        var player = Sherwood.getPlayer();
        if (!player) return;
        this._inventory = player.inventory || [];
        this._expansionLevel = player.bagExpansion || 0;
        this._maxSlots = 10 + this._expansionLevel * 10;
        
        if (player.bagResources) {
            this._resources.gold = player.bagResources.gold || 0;
            this._resources.silver = player.bagResources.silver || 0;
        } else {
            this._resources.gold = player.resources ? (player.resources.gold || 0) : 0;
            this._resources.silver = player.resources ? (player.resources.silver || 0) : 0;
        }
        
        this._save();
    },

    getItems: function() { return this._inventory; },
    getMaxSlots: function() { return this._maxSlots; },
    getFreeSlots: function() { return this._maxSlots - this._inventory.length; },
    isFull: function() { return this._inventory.length >= this._maxSlots; },
    
    getResources: function() { return this._resources; },
    
    getResource: function(type) { return this._resources[type] || 0; },
    
    addResource: function(type, amount) {
        if (!amount || amount <= 0) return;
        if (this._resources[type] === undefined) this._resources[type] = 0;
        this._resources[type] += amount;
        this._save();
    },
    
    spendResource: function(type, amount) {
        if ((this._resources[type] || 0) < amount) return false;
        this._resources[type] -= amount;
        this._save();
        return true;
    },

    getExpansionInfo: function() {
        return {
            current: this._maxSlots,
            level: this._expansionLevel,
            canExpand: this._maxSlots < 150,
            nextSlots: Math.min(this._maxSlots + 10, 150)
        };
    },

    expandBag: function() {
        var info = this.getExpansionInfo();
        if (!info.canExpand) return { success: false, reason: 'Максимум слотов' };
        
        this._expansionLevel++;
        this._maxSlots = 10 + this._expansionLevel * 10;
        
        var player = Sherwood.getPlayer();
        player.bagSize = this._maxSlots;
        player.bagExpansion = this._expansionLevel;
        
        this._save();
        return { success: true, newSlots: this._maxSlots };
    },

    addItem: function(item) {
        if (!item) return false;
        if (this.isFull()) return false;
        
        var maxStack = item.maxStack || 100;
        var quantity = item.quantity || 1;
        
        if (item.id) {
            for (var i = 0; i < this._inventory.length; i++) {
                var existing = this._inventory[i];
                if (existing.id === item.id && (existing.quantity || 1) < maxStack) {
                    var space = maxStack - (existing.quantity || 1);
                    var add = Math.min(quantity, space);
                    existing.quantity = (existing.quantity || 1) + add;
                    quantity -= add;
                    if (quantity <= 0) {
                        this._save();
                        return true;
                    }
                }
            }
        }
        
        while (quantity > 0 && !this.isFull()) {
            var addQty = Math.min(quantity, maxStack);
            var newItem = Object.assign({}, item);
            newItem.quantity = addQty;
            newItem.maxStack = maxStack;
            this._inventory.push(newItem);
            quantity -= addQty;
        }
        
        this._save();
        return true;
    },

    removeItem: function(index, quantity) {
        if (typeof quantity === 'undefined') quantity = 1;
        if (index < 0 || index >= this._inventory.length) return false;
        
        var item = this._inventory[index];
        if (item.quantity && item.quantity > quantity) {
            item.quantity -= quantity;
            this._save();
            return true;
        }
        
        this._inventory.splice(index, 1);
        this._save();
        return true;
    },

    moveItem: function(sourceIndex, targetIndex) {
        if (sourceIndex < 0 || sourceIndex >= this._inventory.length) return { success: false };
        if (targetIndex < 0 || targetIndex >= this._maxSlots) return { success: false };
        
        var sourceItem = this._inventory[sourceIndex];
        var targetItem = this._inventory[targetIndex];
        
        if (targetItem && sourceItem.id === targetItem.id) {
            var maxStack = sourceItem.maxStack || 100;
            var totalQty = (sourceItem.quantity || 1) + (targetItem.quantity || 1);
            if (totalQty <= maxStack) {
                targetItem.quantity = totalQty;
                this._inventory.splice(sourceIndex, 1);
            } else {
                targetItem.quantity = maxStack;
                sourceItem.quantity = totalQty - maxStack;
            }
        } else {
            this._inventory[sourceIndex] = targetItem;
            this._inventory[targetIndex] = sourceItem;
        }
        
        this._save();
        return { success: true };
    },

    _save: function() {
        var player = Sherwood.getPlayer();
        if (!player) return;
        player.inventory = this._inventory;
        player.bagSize = this._maxSlots;
        player.bagExpansion = this._expansionLevel;
        player.bagResources = this._resources;
        Sherwood.saveGame();
    }
};
