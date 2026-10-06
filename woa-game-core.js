/* WOA Game Core — tiny shared layer over Phaser. */
window.WOA=window.WOA||{};
WOA.Game={boot(config){
 if(!window.Phaser)throw new Error("Phaser has not loaded.");
 return new Phaser.Game({type:Phaser.AUTO,parent:config.parent,width:config.width||960,height:config.height||540,backgroundColor:config.background||"#11160e",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true,pixelArt:false},scene:config.scene});
}};
WOA.Game.version="0.1.0";
