"use strict";

function Vector2D()
{	
	this.x = 0.0;
	this.y = 0.0;

	//------------------------------
	this.setXY = function( x_, y_ )
	{	
		this.x = x_;
		this.y = y_;
	}

	//--------------------------------
	this.addXY  = function( x_, y_ )
	{
		this.x += x_;
		this.y += y_;	
	}

	//--------------------------------
	this.addX  = function( x_ )
	{
		this.x += x_;
	}
	
	//--------------------------------
	this.addY  = function( y_ )
	{
		this.y += y_;	
	}
	
	//-----------------------
	this.set = function( p_ )
	{
		this.x = p_.x;
		this.y = p_.y;
	}
	
	//----------------------------------------
	this.setToDifference = function( v1, v2 )
	{
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;		
	} 
	
	//------------------------
	this.add = function( v )
	{
		this.x += v.x;
		this.y += v.y;
	} 

	//---------------------------- 
	this.subtract = function( v )
	{
		this.x -= v.x;
		this.y -= v.y;	
	}

	//----------------------------
	this.getMagnitude = function()
	{
		return Math.sqrt( this.x * this.x + this.y * this.y );	
	}

	//-----------------------------------
	this.getMagnitudeSquared = function()
	{
		return this.x * this.x + this.y * this.y;
	}

	//-----------------------
	this.clear = function()
	{
		this.x = 0.0;
		this.y = 0.0;
	}
	
	//-------------------------
	this.scale = function( s )
	{
		this.x *= s;
		this.y *= s;
	}
	
	//----------------------------------------------
	this.addScaled = function( vectorToAdd, scale ) 
	{ 
		this.x += vectorToAdd.x * scale; 
		this.y += vectorToAdd.y * scale; 
	}

	//-------------------------------------------
	this.setToScaled = function( vector, scale ) 
	{ 
		this.x = vector.x * scale; 
		this.y = vector.y * scale; 
	}

	//----------------------------------------
    this.getDistanceTo = function( position )
    {
        var xx = this.x - position.x;
        var yy = this.y - position.y;
        return Math.sqrt( xx * xx + yy * yy );
    }
}
