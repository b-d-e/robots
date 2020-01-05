/** Class used to create an interactive chord diagram for a given dataset */
 class ChordDiagram {
     /**
      * This is the constructor method, used to initialise an instance of this class when first called. 
      * It creates class variables for each parameter passed in, calculates required dimensions and formats the data ready to be parsed.
      * @param {number} width - The width of the visualisation (used if less than height.
      * @param {number} height - the height of the visualistion (used if less than width)
      * @param {array} inputdata - a 2 dimensional array to be converted into a table of data
      * @param {array} colourscheme - the set of colours to be used in this visualisation
      * @param {string} vizname - the name of the original visualisations source
      * @param {string} vizurl - the url of the original visualisations source
      * @param {string} vizlicense - the license the original visualisations belongs to
      * @param {string} dataname - the name of the data source
      * @param {string} dataurl - the url of the data source
      * @param {string} datalicense - the license this data belongs to */
    constructor (width, height, inputdata, series, colourscheme, vizname, vizurl, vizlicense, dataname, dataurl, datalicense){
        this.width=width;
        this.height=height;
        this.outerRadius = Math.min(this.width, this.height) * 0.5 - 40;
        this.innerRadius = this.outerRadius - 30;
        this.m = inputdata; 
        this.series = series;
        //console.log(series);
        this.colours = colourscheme;
        this.vname = vizname;
        this.vurl = vizurl;
        this.vlicense = vizlicense;
        this.dname = dataname;
        this.durl = dataurl;
        this.dlicense = datalicense;
        this.parseData();
        this.draw();
        this.drawKey();
        this.writeSources();
        //console.log(this.ajax('https://raw.githubusercontent.com/b-d-e/data/master/migrationMatrix.csv', this.callback));
    }
    
    parseData() {
        /**  turn matrix into table */
        var data=[];
        this.m.forEach(function(r,i){ r.forEach(function(c,j){ data.push([i,j,c])})});
        this.data = data;
    }
    //loadFile() {
    //     d3.text("https://raw.githubusercontent.com/b-d-e/data/master/migrationMatrix.csv", function(rawData) {
    //         var lines = rawData.split(",,"); // Will separate each line into an array
    //         for(var a=0; a<lines.length; a++){
    //             lines[a] = lines[a].split(",");
    //         }
    //         lines.splice(lines.length-1,1);
    //         return(lines);
    //     }
    // );

        // ajax(a, b, c){ // URL, callback, just a placeholder
        //     c = new XMLHttpRequest;
        //     c.open('GET', a);
        //     c.onload = b;
        //     c.send()
        // }

        // callback(e){
        //     console.log(this.response);
        //     //return(this.response);
        // }
    
    /**This method takes the prepared data and draws the vizualisation to the screen, calling 'viz' for the original vizualisation to do so. */
    draw() {
        var cols = this.colours;
        var ch = viz.ch().data(this.data).padding(.05)
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .label(function(d){ return ""})
            .startAngle(1.5*Math.PI)
            .fill(function(d){ return cols[d];});

      var svg = d3.select("#vizdiv").append("svg").attr("height",this.height).attr("width",this.width);

      svg.append("g").attr("transform", "translate("+this.width/2+","+this.height/2+")").call(ch);

      // adjust height of frame in bl.ocks.org
      d3.select(self.frameElement).style("height", this.height+"px").style("width", this.width+"px");
    }
    
    /** This method iterates through the series and the colours arrays and draws the datakey to the html document, editing the page via the DOM. Note that this method assumes a prerequisite of a div with the id 'serieskey' to exist already in the html page - this needs to exist to avoid the key being written over the vizualisation. */
    drawKey() {
        document.getElementById("serieskey").innerHTML = "";
        for(var a=0; a<this.series.length; a++){
            document.getElementById("serieskey").innerHTML += "<div style='width:20px;height:20px;border:1px solid #000;background-color:"+this.colours[a]+";'></div><p style='color:black'>"+this.series[a]+ "</p>";

            //document.getElementById("serieskey").insertAdjacentHTML("afterend", "<div style='width:20px;height:20px;border:1px solid #000;background-color:"+this.colours[a]+";'></div><p style='color:black'>"+this.series[a]+ "</p>");
        }
    }

    /** This method writes the references for the sources of the vizualisation and data to the html page. It edits the page via the DOM, and assumes the preexistence of a div with the id 'source' to write the info to. It formats the sources so that each has the source name (acting as a hyperlink to the location it was found) followed by the license under which this source was available. */
    writeSources() {
        document.getElementById("source").innerHTML = "Adapted from original visualisation <a href="+this.vurl+">"+this.vname+"</a> under the following licesnse: "+this.vlicense+".<br>Data sourced from <a href="+this.durl+">"+this.dname+"</a> under the following licesnse: "+this.dlicense+".";
    }
    // get and set methods

    /** This method gets the dimensions of the vizualisation by returning the minimum of width or height.
     * @return {number} - lowest dimension
     */
    getdimensions() {
        return(Math.min(this.width, this.height));
    }

    /** This method returns the set of colours used by the visualisation 
     * @return {array} - the array of colours used to draw the vizualisation
    */
    getcols() {
        return(this.colours);
    }

    /** This method returns the data used when drawing the vizualisation
     * @return {array} - the table of data values, as a 2d array
     */
    getdataset() {
        return(this.data);
    }
 
    /** This method returns an array containing the name, url and license for both the vizualisation and the data
     * @return {array} - the array of [vizualisation name, vizualisation url, vizualisation licesnse, data name, data url, data licesnse]
     */
    getsources() {
        return([this.vname,this.vurl,this.vlicense,this.dname,this.durl,this.dlicense])
    }
    /** This method returns the current data series that the key is using
     * @return {array} - the series of regions / whatever category is being used
     */
    getseries() {
        return(this.series);
    }
    /** This method sets a new dimension for the vizualisation to use if drawn again
     * @param {array} dimArray - the array of [width, height] values to use.
     */
    setdimensions(dimArray) {
        this.width=dimArray[0];
        this.height=dimArray[1];
        d3.select("svg").remove();
        this.draw();
    }

    /** This method takes in an array of new sources, assigns them to the class variables and then calls the write sources method to overwrite the preexisting text
     * @param {array} sources - the set of new sources in the following format: [vizualisation name, vizualisation url, vizualisation licesnse, data name, data url, data licesnse]
     */
    setsources(sources) {
        this.vname = sources[0];
        this.vurl = sources[1];
        this.vlicense = sources[2];
        this.dname = sources[3];
        this.durl = sources[4];
        this.dlicense = sources[5];
        this.writeSources();
    }
    /**This method takes in a new data series, assigns it to the class series variable and then calls the drawKey method to update the HTML document with the new key.
     * @param {array} newSeries - a new data series to be used
     */
    setseries(newSeries){
        this.series = newSeries;
        this.drawKey();
    }

    setcolours(newColours){
        this.colours = newColours;
        d3.select("svg").remove();
        this.draw();
        this.drawKey();
    }

    setdata(newData){
        this.m = newData;
        this.parseData();
        d3.select("svg").remove();
        this.draw();
    }
  }   


function updateColours() {
if(document.getElementById('c_selector').value == "a") {
    chart.setcolours(["#FF0000", "#FF9000", "#FFF400", "#81FF00", "#009737", "#00FFED", "#00A5FF", "#0700FF", "#8800FF", "#FB00FF", "#FF9D9D", "#FFD9A9"]);
}
if(document.getElementById('c_selector').value == "b") {
    chart.setcolours(["#003a30", "#007a65", "#fdf65a", "#fb763c", "#a30000","#ff8fc2","#73ffdf","#8f649f","#172856","#0e0b36","#565656","#2d2d2d"]);
}
if(document.getElementById('c_selector').value == "c") {
    chart.setcolours(["#192E5B", "#1D65A6","#007A2C0", "#00743F","#525B56", "#BE9063","#A4978E", "#A4A4BF","#16235A", "#888C46","#A3586D", "#F0F0F0",]);
}
if(document.getElementById('c_selector').value == "d") {
    chart.setcolours(["#fc1414","#1814fc", "#ff5454", "#5479ff", "#ff7878", "#8178ff", "#ffa8a8", "#a8adff","#ffd4d4", "#e0e6ff", "#000000", "#F0F0F0"]);
}
}
function updateTime() {
if(document.getElementById('t_selector').value == "18") {
    newData = [[0,  8054, 13187,  4314, 3093, 4393, 5864, 6184, 2830, 1057, 3306],
[8111,  0,  27267,  13147,  18071,  9780, 19338,  15022,  8844, 10873,  5348],
[12388, 26101,  0,  23606,  10302,  11734,  15383,  13280,  6750, 2989, 3249],
[3771,  12696,  23155,  0,  24518,  26984,  21901,  23511,  8362, 3399, 2222],
[2764,  16744,  9975, 21898,  0,  11743,  24047,  20445,  16192,  9007, 2326],
[3277,  7377, 8858, 18242,  9100, 0,  82606,  32493,  10901,  3236, 2842, 536],
[7345,  18157,  15932,  18236,  19547,  43422,  0,  74646,  24675,  6799, 7152],
[4535,  11648,  10553,  16982,  16108,  35535,  124751, 0,  40527,  7701, 4954],
[2487,  9449, 6998, 10119,  18652,  16428,  30533,  57919,  0,  13181,  3161],
[944, 10981,  2985, 3705, 10117,  4308, 6656, 11447,  16348,  0,  1312],
[3324,  6284, 4653, 3144, 2906, 4117, 7869, 7341, 4139, 1651, 0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2017 to June 2018.";          
}
if(document.getElementById('t_selector').value == "17") {
    newData = [[0,	7860,	13330,	4280,	3010,	4200,	5500,	5880,	2650,	1060,	3150,	670],
[7950,	0,	26960,	12960,	17880,	9530,	19340,	14860,	8670,	11050,	5210,	1820],
[12240,	25250,	0,	23030,	9880,	11370,	14680,	13210,	6660,	2740,	3290,	550],
[3640,	12580,	23340,	0,	23710,	26860,	21900,	24190,	8620,	3330,	2350,	440],
[2700,	15960,	10060,	21640,	0,	12100,	23430,	20790,	16350,	9450,	2340,	520],
[3090,	7340,	8680,	17450,	8900,	0,	81730,	32370,	10460,	3140,	2760,	550],
[7080,	17350,	15620,	17660,	18990,	42850,	0,	72380,	23340,	6550,	6350,	1260],
[4470,	11140,	10460,	16280,	15390, 35070,	123430,	0,	38900,	7840,	4930,	950],
[2550,	9110,	7060,	10280,	18500,	16440,	29930,	58500,	0,	13240,	3490,	660],
[990,	10890,	3050,	3920,	9850,	4260,	6580,	11250,	15280,	0,	1270,	360],
[3450,	6400,	4410,	3110,	2910,	4150,	7920,	7200,	4080,	1590,	0,	2350],
[510,	1670,	610,	530,	620,	830,	1570,	1340,	740,	330,	1980,	0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2016 to June 2017.";
}
if(document.getElementById('t_selector').value == "16") {
    newData = [[0,	6810,	10700,	3380,	2290,	3390,	4500,	4850,	2250,	980,	3350,	600],
            [6640,	0,	22840,	11000,	15090,	7900,	15460,	12430,	7430,	10390,	5970,	2140],
            [10440,	22290,	0,	19050,	8480,	9490,	11950,	10980,	5620,	2730,	3650,	600],
            [2890,	10280,	18990,	0,	19190,	21120,	17380,	19830,	7130,	3010,	2180,	500],
            [2300,	13580,	8020,	17420,	0,	9470,	18800,	16950,	13320,	8410,	2160,	520],
            [2680,	6520,	7210,	14680,	7430,	0,	73890,	28680,	9330,	2950,	2920,	660],
            [5930,	15040,	13190,	14530,	15420,	36850,	0,	63860,	20250,	6150,	5860,	1260],
            [3870,	10100,	9340,	14290,	13230,	30950,	110180,	0,	34120,	6940,	4860,	890],
            [2040,	8230,	6010,	8790,	15940,	14170,	25550,	50430,	0,	11620,	3320,	730],
            [870,	10170,	2710,	3110,	8710,	3710,	5690,	9160,	12830,	0,	1300,	400],
            [3790,	6830,	4480,	2950,	2800,	4010,	6790,	6760,	3750,	1720,	0,	2420],
            [630,	1800,	670,	550,	670,	810,	1440,	1190,	660,	390,	1950,	0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2015 to June 2016.";
}
if(document.getElementById('t_selector').value == "15") {
    newData = [[0,	6870,	10820,	3580,	2360,	3560,	4400,	4580,	2250,	1010,	3350,	630],
            [6670,	0,	22930,	11130,	15000,	8020,	14870,	12240,	7570,	10190,	6000,	2150],
            [10830,	22050,	0,	19280,	8470,	9530,	11230,	10680,	5710,	2910,	3690,	620],
            [3030,	10300,	19520,	0,	19180,	20820,	16010,	19050,	6980,	3140,	2310,	540],
            [2260,	13440,	8220,	17110,	0,	9390,	17760,	16540,	13250,	8260,	2230,	540],
            [2850,	7120,	7600,	15500,	7630,	0,	72460,	28570,	9500,	3050,	3030,	700],
            [6110,	15790,	13890,	14840,	15870,	38410,	0,	65860,	20640,	6330,	6380,	1410],
            [4070,	10450,	9930,	14640,	13580,	31270,	107490,	0,	35200,7540,	5150,	970],
            [2350,	8250,	6410,	8870,	16670,	13900,	24850,	49420,	0,	12140,	3400,	790],
            [910,	10190,	2730,	2990,	8790,	3620,	5540,	9030,	12000,	0,	1320,	410],
            [3870,	6950,	4570,	3000,	2850,	4050,	7040,	6900,	3760,	1740,	0,	2420],
            [610,	1720,	640,	530,	640,	780,	1420,	1150,	630,	370,	1930,	0]]
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2014 to June 2015.";
}
if(document.getElementById('t_selector').value == "14") {
    newData =[[0,	7010,	11180,	3590,	2510,	3240,	4320,	4710,	2350,	990,	3450,	700],
            [6640,	0,	23070,	11070,	14800,	7460,	13840,	11700,	7400,	10120,	5730,	2080],
            [10720,	22980,	0,	19350,	8650,	9350,	10960,	10710,	5750,	2900,	3630,	660],
            [3110,	10900,	19840,	0,	19090,	20130,	15160,	18530,	7460,	3060,	2650,	570],
            [2250,	14090,	8570,	17840,	0,	9110,	16600,	15570,	13490,	8640,	2360,	640],
            [2890,	7290,	8120,	15930,	7900,	0,	70140,	29330,	9970,	3310,	3100,	750],
            [5890,	16100,	14250,	14990,	15460,	37120,	0,	65570,	20910,	6270,	6440,	1430],
            [4130,	11550,	10340,	15500,	14260,	30860,	105180,	0,	36380,	7720,	5320, 1090],
            [2360,	8800,	6720,	9100,	17100,	13260,	23150,	48920,	0,	12220,	3570,	750],
            [950,	10450,	2760,	3170,	8840,	3500,	5450,	8810,	11860,	0,	1310,	400],
            [4160,	7290,	4810,	3170,	2930,	4390,	6920,	7230,	3980,	1730,	0,	2610],
            [690,	1860,	660,	640,	570, 830,	1350,	1260,	700,	360,	2090,	0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2013 to June 2014.";
}
if(document.getElementById('t_selector').value == "13") {
    newData = [[0,	6890,	10420,	3360,	2210,	2950,	3960,	4390,	2160,	1060,	3270,	790],
                [6760,	0,	22120,	9970,	13600,	6990,	12490,	10600,	6920,	9550,	5550,	2060],
                [10410,	21870,	0,	18020,	8120,	8670,	10200,	9970,	5620,	2830,	3610,	760],
                [3030,	10900,	19640,	0,	17680,	18550,	14490,	17260,	7330,	3010,	2540,	560],
                [2350,	13710,	8590,	17070,	0,	8410,	14890,	14740,	13210,	8290,	2390,	600],
                [2720,	7210,	8050,	15760,	7960,	0,	63660,	27350,	9610,	3130,	3370,	660],
                [5510,	15590,	13400,	14510,	15280,	35580,	0,	63050,	19860,	6130,	6330,	1330],
                [4080,	11340,	10240,	14940,	13960,	30360,	97470,	0,	35570,	7800,	5730,	1130],
                [2300,	8870,	6210,	8740,	16100,	12480,	21520,	44410,	0,	11840,	3570,	790],
                [1030,	10140,	2790,	3210,	8730,	3170,	5100,	8180,	10910,	0,	1360,	400],
                [4130,	6890,	4830,	3250,	3010,	4120,	6480,	6670,	3930,	1700,	0,	2670],
                [580,	1720,	620,	530,	600,	670,	1320,	1140,	690,	340,	2080,	0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2012 to June 2013.";
}
if(document.getElementById('t_selector').value == "12") {
    newData = [[0,	6920,	10630,	3320,	2350,	3080,	3700,	4390,	2280,	1010,	3460,	790],
            [6750,	0,	21590,	10940,	14100,	7250,	13340,	11470,	7410,	9440,	5810,	2450],
            [10510,	22950,	0,	19180,	8830,	9410,	10800,	11030,	5680,	2790,	4090,	740],
            [3300,	11110,	19510,	0,	18440, 19170,	14380,	18170,	7600,	3150,	2900,	550],
            [2390,	13930,	8690,	17110,	0,	8840,	14530,	14860,	13510,	8270,	2290,	560],
            [2970,	7360,	8370,	15650,	7780,	0,	63710,	28370,	9980,	3150,	3590,	740],
            [6190,	16280,	14080,	14460,	15710,	36830,	0,	65540,	20530,	6010,	6490,	1350],
            [4290,	12040,	10550,	15530,	14790,	31260,	100010,	0,	37290,	7620,	6180,	1190],
            [2260,	8960,	6550, 8920,	16300,	12870,	22120, 45890,	0,	11280,	3800,	770],
            [1030,	10500,	3040,	3330,	9540,	3600,	5330,	9160,	11770,	0,	1450,	490],
            [4130,	6960,	4510,	2970,	2840,	3720,	5980,	6410,	3530,	1640,	0,	2430],
            [620,	1780,	700,	530,	550,	630,	1240,	1090,	700,	400,	2020,	0]];
    newTitle = "An interactive chord diagram to show internal migration between UK regions in the period July 2011 to June 2012.";
}
document.getElementById("main_title").innerHTML = newTitle;
chart.setdata(newData);
}
