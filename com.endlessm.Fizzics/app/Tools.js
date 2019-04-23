var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var TOOL_FLING   = 0;
var TOOL_MOVE    = 1;
var TOOL_CREATE  = 2;
var TOOL_DELETE  = 3;
var TOOL_SPECIES = 4;
var NUM_TOOLS    = 5;

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
        this.imageSelected = new Image();
        this.imagePath = "";
        this.disabled  = false;
        this.selected  = false;
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
        }
        
        this.buttons[ TOOL_FLING  ].image.src = "images/fling-tool.png";
        this.buttons[ TOOL_MOVE   ].image.src = "images/move-tool.png";
        this.buttons[ TOOL_CREATE ].image.src = "images/create-tool.png";
        this.buttons[ TOOL_DELETE ].image.src = "images/delete-tool.png";

        this.buttons[ TOOL_FLING  ].imageSelected.src = "images/fling-tool-selected.png";
        this.buttons[ TOOL_MOVE   ].imageSelected.src = "images/move-tool-selected.png";
        this.buttons[ TOOL_CREATE ].imageSelected.src = "images/create-tool-selected.png";
        this.buttons[ TOOL_DELETE ].imageSelected.src = "images/delete-tool-selected.png";

        this.backgroundImage.src     = "images/tool-panel-background.png";
        this.speciesSelectImage.src  = "images/species-selection.png";
        
        var yy = 0;
        this.buttons[ TOOL_FLING    ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_MOVE     ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_CREATE   ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
        this.buttons[ TOOL_DELETE   ].position.setXY( left, top +  yy * buttonYSpacing ); yy++;
         
        this.buttons[ TOOL_SPECIES  ].position.setXY( left + buttonSize + speciesButtonMargin, this.buttons[ TOOL_CREATE ].position.y );
        this.buttons[ TOOL_SPECIES  ].height = speciesToolHeight;
        this.buttons[ TOOL_SPECIES  ].image.src = "images/tool-panel-background.png";
        this.buttons[ TOOL_SPECIES  ].imageSelected = this.buttons[ TOOL_SPECIES  ].image;
        this.buttons[ TOOL_SPECIES  ].visible = false;
    
        globalParameters.moveToolActive    = true;
        globalParameters.flingToolActive   = true;
        globalParameters.createToolActive  = true;
        globalParameters.deleteToolActive  = true;
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
        // Deselect all
        for (var i=0; i<NUM_TOOLS; i++)
            this.buttons[i].selected = false;
        
        // Select button
        if (t >= 0 && t < NUM_TOOLS)
            this.buttons[t].selected = true;
        
        this.buttons[ TOOL_SPECIES ].visible = ( t == TOOL_SPECIES ) ? true : ( t == TOOL_CREATE );
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
                if ( this.buttons[t].visible && !this.buttons[t].disabled)
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

        this.buttons[ TOOL_MOVE     ].disabled = globalParameters.moveToolDisabled;
        this.buttons[ TOOL_FLING    ].disabled = globalParameters.flingToolDisabled;
        this.buttons[ TOOL_CREATE   ].disabled = globalParameters.createToolDisabled;
        this.buttons[ TOOL_DELETE   ].disabled = globalParameters.deleteToolDisabled;

        for (var i=0; i<this.numSpecies; i++)
            this.speciesImages[i].src = `images/ball-${globalParameters['imageIndex_'+i]}.png`;
    }
    
    //------------------------------------
    this.getSelectedSpecies = function()
    {            
        return this.selectedSpecies;
    }

    //--------------------------
    this.isPositionOverButton = function(x, y)
    {
        for (var i = 0; i < NUM_TOOLS; i++)
        {
            const button = this.buttons[i];
            if ( button.visible && !button.disabled &&
                 x > button.position.x && x < button.position.x + button.width &&
                 y > button.position.y && y < button.position.y + button.height)
                return true;
        }
        return false;
    }

    //--------------------------
    this.render = function()
    {            
      canvas.drawImageCached( this.backgroundImage, left - backgroundMargin, top - backgroundMargin, backgroundWidth, backgroundHeight );
    
        for (var t=0; t<NUM_TOOLS; t++)
        {
            var b = this.buttons[t];

            if ( t == TOOL_SPECIES && !b.visible)
                continue;

            if (!b.visible || b.disabled) {
                canvas.globalCompositeOperation = 'multiply';
                canvas.globalAlpha = 0.5;
            }

            canvas.drawImageCached
            (
                b.selected ? b.imageSelected || b.image : b.image,
                b.position.x,
                b.position.y,
                b.width,
                b.height
            );

            if (!b.visible || b.disabled) {
                canvas.globalCompositeOperation = 'source-over';
                canvas.globalAlpha = 1;
            }

            if ( t == TOOL_SPECIES )
            {
                for (var s=0; s<this.numSpecies; s++)
                {
                    var x = b.position.x + speciesImageMargin;
                    var y = b.position.y + speciesImageMargin;

                    canvas.drawImageCached( this.speciesImages[s],   x, y + speciesImageRadius * s,                    speciesImageRadius, speciesImageRadius );
                    canvas.drawImageCached( this.speciesSelectImage, x, y + speciesImageRadius * this.selectedSpecies, speciesImageRadius, speciesImageRadius );
                }
            }
        }      
    }              
}

