var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var TOOL_FLING     =  0;
var TOOL_MOVE      =  1;
var TOOL_CREATE    =  2;
var TOOL_DELETE    =  3;
var TOOL_SPECIES   =  4;
var TOOL_LEVEL_1   =  5;
var TOOL_LEVEL_2   =  6;
var TOOL_LEVEL_3   =  7;
var TOOL_LEVEL_4   =  8;
var TOOL_RESET     =  9;
var NUM_TOOLS      = 10;

var SHOW_LEVEL_TOOLS = false;

//------------------
function Tools()
{            
    function Button()
    {    
        this.visible   = false;
        this.position  = new Vector2D();
        this.width     = ZERO;
        this.height    = ZERO;
        this.image     = new Image();
        this.imagePath = "";
    }

    this.buttons = new Array( NUM_TOOLS );
    this.speciesSelectImage  = new Image();
    this.speciesImages       = new Array();
    this.backgroundImage     = new Image();
    this.selectedSpecies     = 0;
    this.numSpecies          = 0; 

    //------------------------------
    // values for layout and such
    //------------------------------
    var left                = 50.0;
    var top                 = 50.0;
    var backgroundMargin    = 10;
    var backgroundWidth     = 70;
    var backgroundHeight    = 235;   
    var speciesButtonMargin = 10;
    var resetX              = 600;
    var resetY              = 2;
    var resetWidth          = 32;
    var resetHeight         = 32;
    var speciesToolHeight   = 210;
    var buttonSize          = 50.0;
    var buttonYSpacing      = 55.0;
    var speciesImageRadius  = 38;
    var speciesImageMargin  = 5;
    
    //--------------------------
    this.initialize = function()
    {            
        for (var t=0; t<NUM_TOOLS; t++)
        {
            this.buttons[t] = new Button();        
            this.buttons[t].visible = true;
            this.buttons[t].width  = buttonSize;
            this.buttons[t].height = buttonSize;
            this.buttons[t].image.src = "images/move-tool.png";
        }
        
        this.backgroundImage.src     = "images/tool-panel-background.png"; 
        this.speciesSelectImage.src  = "images/species-selection.png";
        
        var yy = 0;
        this.buttons[ TOOL_FLING    ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_MOVE     ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_CREATE   ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_DELETE   ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
    
        yy += 5;
        this.buttons[ TOOL_LEVEL_1 ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_LEVEL_2 ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_LEVEL_3 ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_LEVEL_4 ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
    
        this.buttons[ TOOL_MOVE    ].image.src = "images/move-tool.png";
        this.buttons[ TOOL_FLING   ].image.src = "images/fling-tool.png";
        this.buttons[ TOOL_CREATE  ].image.src = "images/create-tool.png";
        this.buttons[ TOOL_DELETE  ].image.src = "images/delete-tool.png";
        this.buttons[ TOOL_LEVEL_1 ].image.src = "images/level-1-tool.png";
        this.buttons[ TOOL_LEVEL_2 ].image.src = "images/level-2-tool.png";
        this.buttons[ TOOL_LEVEL_3 ].image.src = "images/level-3-tool.png";
        this.buttons[ TOOL_LEVEL_4 ].image.src = "images/level-4-tool.png";

        this.buttons[ TOOL_SPECIES  ].position.setXY( left + buttonSize + speciesButtonMargin, this.buttons[ TOOL_CREATE ].position.y );
        this.buttons[ TOOL_SPECIES  ].height = speciesToolHeight;
        this.buttons[ TOOL_SPECIES  ].image.src = "images/tool-panel-background.png";
        this.buttons[ TOOL_SPECIES  ].visible = false;
    
        globalParameters.moveToolActive    = true;
        globalParameters.flingToolActive   = true;
        globalParameters.createToolActive  = true;
        globalParameters.deleteToolActive  = true;
    
        this.buttons[ TOOL_RESET ].position.setXY( resetX, resetY );
        this.buttons[ TOOL_RESET ].width     = resetWidth;
        this.buttons[ TOOL_RESET ].height    = resetHeight;
        this.buttons[ TOOL_RESET ].image.src = "images/reset-tool.png";;
        this.buttons[ TOOL_RESET ].visible   = true;
    
        if ( !SHOW_LEVEL_TOOLS )
        {
            this.buttons[ TOOL_LEVEL_1 ].visible = false;
            this.buttons[ TOOL_LEVEL_2 ].visible = false;
            this.buttons[ TOOL_LEVEL_3 ].visible = false;
            this.buttons[ TOOL_LEVEL_4 ].visible = false;
        }        
    }
    
    
    //------------------------------------------
    this.setNumSpecies = function( numSpecies )
    {            
        this.numSpecies = numSpecies;
        
        for (var s=0; s<this.numSpecies; s++)
        {
            this.speciesImages[s] = new Image();
        }
    }
    

    //-----------------------------
    this.select = function(t)
    {
        this.buttons[ TOOL_MOVE     ].image.src = "images/move-tool.png";
        this.buttons[ TOOL_FLING    ].image.src = "images/fling-tool.png";
        this.buttons[ TOOL_CREATE   ].image.src = "images/create-tool.png";
        this.buttons[ TOOL_DELETE   ].image.src = "images/delete-tool.png";
        
             if ( t == TOOL_MOVE    ) { this.buttons[t].image.src = "images/move-tool-selected.png";     document.body.style.cursor = "grab";        }
        else if ( t == TOOL_FLING   ) { this.buttons[t].image.src = "images/fling-tool-selected.png";    document.body.style.cursor = "move";        }
        else if ( t == TOOL_CREATE  ) { this.buttons[t].image.src = "images/create-tool-selected.png";   document.body.style.cursor = "crosshair";   }
        else if ( t == TOOL_DELETE  ) { this.buttons[t].image.src = "images/delete-tool-selected.png";   document.body.style.cursor = "not-allowed"; }
        
        if ( t == TOOL_SPECIES )
        {
            this.buttons[t].image.src = "images/tool-panel-background.png";  
            this.buttons[ TOOL_SPECIES ].visible = true; 
        }                     
        else if ( t == TOOL_CREATE )
        {
            this.buttons[ TOOL_SPECIES ].visible = true;
        }
        else
        {
            this.buttons[ TOOL_SPECIES ].visible = false;
        }
    }
    

    //----------------------------------
    this.mouseClick = function( x, y )
    {
        var selectedTool = -1;
        
        for (var t=0; t<NUM_TOOLS; t++)
        {
            if (( x > this.buttons[t].position.x )
            &&  ( x < this.buttons[t].position.x + this.buttons[t].width )
            &&  ( y > this.buttons[t].position.y )
            &&  ( y < this.buttons[t].position.y + this.buttons[t].height ))
            {
                if ( this.buttons[t].visible )
                {
                    selectedTool = t;
                    this.select(t);

                    if ( t == TOOL_SPECIES )
                    {
                        var h = ( y - this.buttons[t].position.y ) / this.buttons[t].height;        
                        this.selectedSpecies = Math.floor( h * this.numSpecies );   
                    }                
                } 
            }
        } 
        
        return selectedTool;  
    }    


    //--------------------------------
    this.applyParameters = function()
    {
        this.buttons[ TOOL_MOVE     ].visible = globalParameters.moveToolActive;
        this.buttons[ TOOL_FLING    ].visible = globalParameters.flingToolActive;
        this.buttons[ TOOL_CREATE   ].visible = globalParameters.createToolActive;
        this.buttons[ TOOL_DELETE   ].visible = globalParameters.deleteToolActive;
    }
    

    //------------------------------------
    this.getSelectedSpecies = function()
    {            
        return this.selectedSpecies;
    }
    

    //--------------------------
    this.render = function()
    {            
      canvas.drawImage( this.backgroundImage, left - backgroundMargin, top - backgroundMargin, backgroundWidth, backgroundHeight );
    
        for (var t=0; t<NUM_TOOLS; t++)
        {
            if ( this.buttons[t].visible )
            {
                canvas.drawImageCached
                ( 
                    this.buttons[t].image, 
                    this.buttons[t].position.x, 
                    this.buttons[t].position.y, 
                    this.buttons[t].width, 
                    this.buttons[t].height 
                );
            
                if ( t == TOOL_SPECIES )
                {
                    for (var s=0; s<this.numSpecies; s++)
                    {
                        var imageID = 0;
            
                             if ( s == 0 ) { imageID = globalParameters.imageIndex_0; }
                        else if ( s == 1 ) { imageID = globalParameters.imageIndex_1; }
                        else if ( s == 2 ) { imageID = globalParameters.imageIndex_2; }
                        else if ( s == 3 ) { imageID = globalParameters.imageIndex_3; }
                        else if ( s == 4 ) { imageID = globalParameters.imageIndex_4; }

                        this.speciesImages[s].src = "images/ball-" + imageID + ".png"  
                
                        var x = this.buttons[t].position.x + speciesImageMargin;
                        var y = this.buttons[t].position.y + speciesImageMargin;
                        
                        canvas.drawImage( this.speciesImages[s],   x, y + speciesImageRadius * s,                    speciesImageRadius, speciesImageRadius );
                        canvas.drawImage( this.speciesSelectImage, x, y + speciesImageRadius * this.selectedSpecies, speciesImageRadius, speciesImageRadius );
                    }
                }                
            }
        }      
    }              
}

