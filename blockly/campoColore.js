// Palette dei colori personalizzata

Blockly.CampoColore=function(a,b){Blockly.CampoColore.superClass_.constructor.call(this,a,b);this.setText(Blockly.Field.NBSP+Blockly.Field.NBSP+Blockly.Field.NBSP)};
goog.inherits(Blockly.CampoColore,Blockly.Field);
Blockly.CampoColore.prototype.colours_=null;
Blockly.CampoColore.prototype.columns_=0;
Blockly.CampoColore.prototype.init=function(){Blockly.CampoColore.superClass_.init.call(this);this.borderRect_.style.fillOpacity=1;this.setValue(this.getValue())};
Blockly.CampoColore.prototype.CURSOR="default";
Blockly.CampoColore.prototype.dispose=function(){Blockly.WidgetDiv.hideIfOwner(this);Blockly.CampoColore.superClass_.dispose.call(this)};
Blockly.CampoColore.prototype.getValue=function(){return this.colour_};
Blockly.CampoColore.prototype.setValue=function(a){this.sourceBlock_&&Blockly.Events.isEnabled()&&this.colour_!=a&&Blockly.Events.fire(new Blockly.Events.BlockChange(this.sourceBlock_,"field",this.name,this.colour_,a));this.colour_=a;this.borderRect_&&(this.borderRect_.style.fill=a)};
Blockly.CampoColore.prototype.getText=function(){var a=this.colour_,b=a.match(/^#(.)\1(.)\2(.)\3$/);b&&(a="#"+b[1]+b[2]+b[3]);return a};
Blockly.CampoColore.COLOURS="#ff0000 #00ff00 #0000ff #ffff00 #ff00ff #00ffff #ffffff".split(" ");
Blockly.CampoColore.COLUMNS=1;
Blockly.CampoColore.prototype.setColours=function(a){this.colours_=a;return this};
Blockly.CampoColore.prototype.setColumns=function(a){this.columns_=a;return this};
Blockly.CampoColore.prototype.showEditor_=function(){Blockly.WidgetDiv.show(this,this.sourceBlock_.RTL,Blockly.CampoColore.widgetDispose_);var a=new goog.ui.ColorPicker;a.setSize(this.columns_||Blockly.CampoColore.COLUMNS);a.setColors(this.colours_||Blockly.CampoColore.COLOURS);var b=goog.dom.getViewportSize(),c=goog.style.getViewportPageOffset(document),d=this.getAbsoluteXY_(),e=this.getScaledBBox_();a.render(Blockly.WidgetDiv.DIV);a.setSelectedColor(this.getValue());var f=goog.style.getSize(a.getElement());f.height=107;d.y=d.y+f.height+e.height>=b.height+c.y?d.y-(f.height-1):d.y+(e.height-1);this.sourceBlock_.RTL?(d.x+=e.width,d.x-=f.width,d.x<c.x&&(d.x=c.x)):d.x>b.width+c.x-f.width&&(d.x=b.width+c.x-f.width);b.height=2+15*Blockly.CampoColore.COLOURS.length;b.width=19;Blockly.WidgetDiv.position(d.x,d.y,b,c,this.sourceBlock_.RTL);var g=this;Blockly.CampoColore.changeEventKey_=goog.events.listen(a,goog.ui.ColorPicker.EventType.CHANGE,function(a){a=a.target.getSelectedColor()||"#000000";Blockly.WidgetDiv.hide();g.sourceBlock_&&(a=g.callValidator(a));null!==a&&g.setValue(a)})};
Blockly.CampoColore.widgetDispose_=function(){Blockly.CampoColore.changeEventKey_&&goog.events.unlistenByKey(Blockly.CampoColore.changeEventKey_);Blockly.Events.setGroup(!1)};