//Plant Class
const Plants = {
	Grass:{
		images:["SmallGrass.png", "MediumGrass.png", "LargeGrass.png"],
		stages:3,
		timeToGrow:100,
		waterToGrow:6,
		
	},
	Corn:{
		images:[],
		stages:3,
		timeToGrow:300,
		waterToGrow:12
	}
	images:[],
	growthRate:100,
	
}


function PlantClass(img, growthRate)