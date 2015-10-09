/*  Goals today

Major things left to do:
  4. App complete - check for errors


Things being completed today:




*/

//modular pattern using a sif revealing public methods to the global scope
  //
(function() {
  //assigning some useful variables
	var canvasWidth = 800, canvasHeight = 500;
	var ctx = document.getElementById('generated-chart').getContext('2d');
	var newChart, data;
  
  /* Regex Patterns */
  var dsPattern = /(\d+(,)*\s*)+/gi;
  defaultLabels = ['a,', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];
  var autoLabels;
  
  var graphtype = 'Line'; // the default graph type
  var longestArr = 0;
  
  var ConfigDefaults = {
    Graph: 'Radar',
    datasetsAllowed: 9
    //...
  };
  
  var optionsArr = [];
  
  var errorMessages = {
    empty: 'sorry, the datafields can not be empty, you can remove them if not neccesary',
    wrong: 'sorry, the datafields accept only numbers seperated by a single comma',
    label: 'sorry, not enough labels for the datasets',
    color: 'sorry, please set colors for each data set'
  };
  
  //setting chart global default options
  Chart.defaults.global.responsive= false;
  Chart.defaults.global.onAnimationComplete= canvasToImage;
  //
  
  //cache JQuery DOM elements
  var $view1      = $('#typeview1'),
      $view2      = $('#typeview2');
  
  var $window     = $('window'),
      $submitData = $('#submit-data'),
      $dataSet1   = $('#dataset1'),
      $dataSet2   = $('#dataset2'),
      $xlabels    = $('#xlabels'),
      $datasets   = $('#datasets');
  //add, remove dataset links
  var $addDataBtn = $('#add-ds');
	var $rmDataBtn  = $('#rm-ds');
  var $optionsContainer = $('#switch-options');
  
  // The type of chart clicked and display on the user screen
  var $chartTypeClicked = "";
  
  //This is the first data template for Line, Bar, Radar charts
	var templateData = {
	    labels: ['label1', 'label2', 'label3', 'label4', 'label5', 'label6'],
	    datasets: [
	        {
	          label: '',
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#2ecc71",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
	        },
	        {
            label: "",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#2ecc71",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
	        }
	    ]
	};
  //note: templateData['datasets'][i]['data'] //templateData['labels'];
  
  // This is the second type of data template for Pie, Donut, and Polar charts
  var templateData2 = [
    {
        value: 0,
        color:"",
        highlight: "",
        label: ""
    },
    {
        value: 0,
        color:"",
        highlight: "",
        label: ""
    }
  ];
  
	//Master options template for all the charts types use this object
	var templateOptions = {};
  
  /* Helper Functions */

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
	
  // determines what type1 chart dataset is the longest length
  function prepAutoLabels() {            
    var dcArr = $('#datasets .form-control');
    
    $.each(dcArr, function(index, item) {
      var itemArr = item.value.split(',');
      if ( itemArr.length > longestArr ) {
        longestArr = itemArr.length;
        //console.log('longest len so far is: '+ longestArr);
      }
    });
    // generates a set of auto labels based on the longest dateset
      autoLabels = defaultLabels.slice(0, longestArr);
  }
  
  // chart error handling, pretty basic function
  function printErrorMessages(error, view) {
    var errorText = errorMessages[''+ error];
    $('.error-message'+ view).text(errorText).removeClass('hidden'); console.log('yes!');    
  }
  
  function clearErrors() {
    $('.error-message1').addClass('hidden');
    $('.error-message2').addClass('hidden');
  }
  
  //if the data inputs have data entered in or not
  function inputHasData() {
    var hasInput;
    var dataInputs = $('#datasets .added-inputs');
    
    for (var i = 0; i < dataInputs.length; i++) {
      if( dataInputs[i].value === "" ) { return false; }
    }
    return true;
  }
  
  // changes the title text
  function changeTitle(type) {
    var $title = $('.type-title');
    $title.html(type);
  }
  
	
  
  /* App Core Function Flow 
  # 
  */
    
	function appInit() {
    mobileNav();
    colorSelector();
    initialRender();
    eventBindings();
	}
	
	function initialRender() {
		newChart = new Chart(ctx).Line(templateData, templateOptions);
	}
    
  function eventBindings() {
    //binds event handlers, mainly the submit button.
    $submitData.on('click', renderOnSubmit);
    $('#submit-data2').on('click', renderOnSubmit);
    
    //add ds, remove ds events
    $addDataBtn.on('click', addDataSet);
    $rmDataBtn.on('click', removeDataSet);
    
    //charttype switch event bindings
    $('span.chart-type').on('click', chartTypeController);
    $('select#mobile-nav').on('change', mobileChartCtrl);
    
    //chartype2 add remove binding
    $('#add-slice').on('click', addSlice);
    $('#rm-slice').on('click', removeSlice);
    
  }
  
  // Makes the select mobile navigation and appends to the page
  function mobileNav() {
    
    $('<select />', {
      "id": "mobile-nav"
    }).prependTo('#type-select');
    
    $('span.chart-type a').each(function() {
      var $el = $(this);
      $('<option />', {
        "value": $el.attr("href"),
        "text" : $el.text()
      }).appendTo('#type-select select');
    });
  }
  
  /*
  * fn to changed the view depending on what chart type is picked
  */
  function chartTypeController(e, mt) {
    e.preventDefault();
    
    var $el = $(this);
    var windowWidth = $(window).width();
    if ( windowWidth > 600 ) {
      console.log($window.width());
      var $chartTypeClicked = $el.attr('data-type').toString();
    }
    
  // Input labels controller
    if ($chartTypeClicked === 'line'  ||
        $chartTypeClicked === 'bar'   ||
        $chartTypeClicked === 'radar' ||
        mt === 'Line' ||
        mt === 'Bar'  ||
        mt === 'Radar' )
    {
      $view2.addClass('type-hidden');
      $view1.removeClass('type-hidden');
    }
    else {
      $view2.removeClass('type-hidden');
      $view1.addClass('type-hidden');
      // Removes all added datasets on chart view changes
      var numSetsAdded = templateData.datasets.length - 2;    
      for (var i = numSetsAdded; i > 0; --i) {
        removeDataSet();
      }
    }
    
    //clear the options module
    $('div#switch-options').empty();
    
    //change the option panel view...
    if ($chartTypeClicked === 'line' || mt === 'Line') {
      changeTitle('Line Graph');
      
      optionsArr = [
        {optionName: 'scaleShowGridLines', optionText: 'gridlines', checked: true},
        {optionName: 'bezierCurve', optionText: 'bezier curves', checked: true},
        {optionName: 'datasetFill', optionText: 'color fill', checked: true},
        {optionName: 'pointDot', optionText: 'grid dots', checked: true}
      ];
      writeOptions();
    }
    else if ($chartTypeClicked === 'bar' || mt === 'Bar') {
      changeTitle('Bar Graph');

      optionsArr = [
        {optionName: 'scaleShowGridLines', optionText: 'gridlines', checked: true},
        {optionName: 'scaleBeginAtZero', optionText: 'scale zero', checked: true}
      ];
      writeOptions();
    }
    else if ($chartTypeClicked === 'radar' || mt === 'Radar') {
      changeTitle('Radar Graph');
      
      optionsArr = [
        {optionName: 'scaleShowLine', optionText: 'scale lines', checked: true},
        {optionName: 'angleShowLineOut', optionText: 'angle lines', checked: true},
        {optionName: 'scaleShowLabels', optionText: 'scale labels', checked: true},
        {optionName: 'pointDot', optionText: 'dot points', checked: true},
        {optionName: 'datasetStroke', optionText: 'dataset strokes', checked: true},
        {optionName: 'datasetFill', optionText: 'dataset fill', checked: true}
      ];
      writeOptions();
    }
    else if ($chartTypeClicked === "pie" || mt === "Pie" ||
              $chartTypeClicked === "donut" || mt === "Doughnut")
    {
      if ($chartTypeClicked === "pie" || mt === "Pie") {
        changeTitle('Pie Graph');
      }
      if ($chartTypeClicked === "donut" || mt === "Doughnut") { changeTitle('Doughnut Graph') }
      
      optionsArr = [
        {optionName: 'segmentShowStroke', optionText: 'segment stroke', checked: true},
        {optionName: 'animateRotate', optionText: 'animate rotate', checked: false},
        {optionName: 'animateScale', optionText: 'animate scale', checked: false}
      ];
      writeOptions();
    }
    else {
      changeTitle('Polar Graph');
      
      optionsArr = [
        {optionName: 'scaleShowLabelBackdrop', optionText: 'scale backdrop', checked: true},
        {optionName: 'scaleBeginAtZero', optionText: 'scale zero', checked: true},
        {optionName: 'scaleShowLine', optionText: 'scale line', checked: true},
        {optionName: 'segmentShowStroke', optionText: 'segment stroke', checked: true},
        {optionName: 'animateRotate', optionText: 'animate rotate', checked: false},
        {optionName: 'animateScale', optionText: 'animate scale', checked: false}
      ];
      writeOptions();
    }
    
    // sets the chart type the correct one
    if ($chartTypeClicked === "polar" || mt === "Polar") {
      graphtype = "PolarArea";
    }
    else {
      graphtype = $el.text().toString() || mt;
    }
    //console.log('current graph type is '+ graphtype);
  }

  function mobileChartCtrl() {
    var mobileType = $('select option:selected').text();
    chartTypeController(mobileType);
  }
  
  function writeOptions() {
    for (var i = 0; i < optionsArr.length; ++i) {
      $('<input></input>').attr({
        'class': 'switch',
        'id'   : optionsArr[i].optionName,
        'type' : 'checkbox'
      }).prop('checked', optionsArr[i].checked).appendTo($optionsContainer);
      $('<label></label>').attr({
        "class": "switch",
        "for"  : optionsArr[i].optionName,
      }).text(optionsArr[i].optionText).appendTo($optionsContainer);
    }
  }
  
  function colorSelector() {
  	$(".color-select").spectrum({
  	    showPaletteOnly: true,
  	    showPalette:true,
  	    color:'rgba(255, 255, 255, .5)',
  	    palette: [
  	        ['rgba(57, 106, 177, 1)', 
            'rgba(218, 124, 48, 1)', 
            'rgba(62, 150, 81, 1)',
  	        'rgba(204, 37, 41, 1)', 
            'rgba(83, 81, 84, 1)', 
            'rgba(107, 76, 154, 1)', 
            'rgba(146, 36, 40, 1)', 
            'rgba(148, 139, 61, 1)'],
          
          ['rgba(102,194,165, 1)',
          'rgba(252,141,98, 1)',
          'rgba(141,160,203, 1)',
          'rgba(231,138,195, 1)',
          'rgb(166,216,84, 1)',
          'rgba(255,217,47, 1)', 
          'rgba(229,196,148, 1)',
          'rgba(179,179,179, 1)']
  	    ]
  	});
      $('.color-select').removeClass('color-select').addClass('color-initialize');
  }
  
	function renderOnSubmit() {
    //attempts to clear the canvas as there are many glitches on repeated rendering
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (newChart) {
    //newChart.clear().destroy();
    }
    
    if (inputHasData()) {
      //clear error messages from previous rounds
      clearErrors();
      
      //prepare auto labels if the field is empty
      prepAutoLabels();
         
      //set the chart data to new values and re-renders the canvas
      //setChartData();
      graphtype === "Line"||
      graphtype === "Bar"||
      graphtype === "Radar" ? setChartData() : setChartData2();
      
      if (graphtype === "Line" || "Bar" || "Radar") {
        newChart.clear().destroy();
  		  newChart = new Chart(ctx)[graphtype]( templateData, templateOptions );
      }
      if (graphtype === "Pie" || "Donut" || "PolarArea") {
        console.log('asdf')
        newChart.clear().destroy();
  		  newChart = new Chart(ctx)[graphtype]( templateData2, templateOptions );
      }
      // Draw the image from canvas
      
      
      
    }
    else { printErrorMessages('empty', 1); }
  }
  
  // Sets the main data values for renderOnSubmit
	function setChartData() {
    /* Action Plan
     *
    */    
    
    //sets the color of each dataset to the user chosen color
      var $selectedColors = $('#typeview1 .color-initialize');
      
      $.each($selectedColors, function(index, item) {
        var ttemp = item.value;
      // throw an error if the color is not set
        if (ttemp === "") {
          printErrorMessages('color', 1);
          //throw new Error('error input');
          return;
        }
      // sets the color data in the template object
        templateData.datasets[index].strokeColor = ttemp;
        templateData.datasets[index].pointColor = ttemp;
        templateData.datasets[index].pointHighlightStroke = ttemp;
      // lightens the color for the fill
        ttemp = 'rgba'+ ttemp.slice(3, ttemp.length - 1) + ', 0.2)';
        templateData.datasets[index].fillColor = ttemp;
      });

    // grabs the user entered labels and modifies the templateData object
      var xlabelsArr  = $xlabels.val().split(",");
      console.log(xlabelsArr.length+ " "+ longestArr);
      
      if ( $xlabels.val() === "" || xlabelsArr.length === 0 ) {
        //console.log('writing autolabels into data object');
        templateData.labels = autoLabels;
      }
      else if ( xlabelsArr.length < longestArr && xlabelsArr.length !== 0 ) { 
        printErrorMessages('label', 1);
        return;
        //throw new Error('error: not enough labels');
      }
      else {
        templateData.labels = xlabelsArr;        
      }
      
    // get the dataset inputs and modifies the templateObject for each user input
      var dcArr = $('#datasets .form-control');
      $.each(dcArr, function(index, item) {
        var curItem = (item.value).split(',').map(function(item) {
          return parseInt(item, 10);
        });
        
        //making sure all items are numerical:
        curItem.forEach(function(el, i, arr) {
          if( !(isNumber(el)) ) {
            //console.log(i+ ' not a number');
            printErrorMessages('wrong', 1);
            throw new Error("input format error!");
          }
        });
        templateData.datasets[index].data = curItem;
      });
      
      //setting up the options for each graph type.
      setOptions();
	}
  
  function setChartData2() {
    console.log('2');
    var $slices = $('.data-slices');
    //var $colors = $('#typeview1 .color-initialize');
    
    $.each($slices, function(index, item) {
      var labelVal = $(item).find('.labels').val();
      var dataVal = $(item).find('.slice-data').val();
      var colorVal = $(item).find('.color-initialize').val().toString();

      if (labelVal === "" || dataVal === "") {
        printErrorMessages('empty', 2);
        //throw new Error('fields empty');
        return;
      }
      if (colorVal === "") {
        printErrorMessages('color', 2);
        return;
      }
      
      templateData2[index].value = parseInt(dataVal);
      templateData2[index].color = colorVal;
      templateData2[index].highlight = colorVal;
      templateData2[index].label = labelVal;
    
      //console.log(templateData2);
    });
  
    setOptions();
  }
  
  function setOptions() {

  //Charttype Line options
    currentPageOptions = $('[type=checkbox]');
  
    $.each(currentPageOptions, function(index, item) {
      console.log( item.id );
      templateOptions[item.id] = item.checked;
      console.log( item.checked );
    });
  }
  
//add data slice for pie, doughnut, polar
  function addSlice(evt) {
    evt.preventDefault();
    var newSlice = {
        value: 0,
        color:"",
        highlight: "",
        label: ""
    };
    if(templateData2.length > 12) {
      console.log('limit reached');
      return;
    }
    else {
      templateData2.push(newSlice);
      console.log(templateData2.length);
      
      //adding the html elements to the page
      var $div = $('<div>', {class: "container data-slices col-6"});
      var $inputLabel = $('<input>', {class: "labels col-10", type: "text"});
      var $inputData = $('<input>', {class: "slice-data col-10", type: "number"});
      var $color = $('<input>', {class: "color-select color2"});
     
      $div.append($inputLabel).append($inputData).append($color);
      $('.data-slices').last().after($div);
      colorSelector();
    }
    dataLinksStyle2();
  }
  
  function removeSlice(evt) {
    evt.preventDefault();
    if(templateData2.length < 2) {
      return;
    }
    else {
      templateData2.pop(); console.log(templateData2.length);
      $('.data-slices').last().remove();
    }
    dataLinksStyle2();
  }
  
  
  function addDataSet(evt) {
    evt.preventDefault();
    var dsArr = templateData.datasets;
    var newDS = {
          label: '',
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
    };
    //if the number of datasets is greater than datasetsAllowed, can not add
    if(dsArr.length >= ConfigDefaults.datasetsAllowed) {
      //console.log('dataset limit reached, can not add another set'+ dsArr.length);
      return;
    }
    
    //else add a new data object at the end of datasets object
    else {
      dsArr.push(newDS);      
      //Now append the html element to the page to allow user entry
      var $dataInputDiv = $('<div>', {id:"", class: "container af"});
      var $dataInputEl = $('<input />', {id: "", class: "form-control added-inputs"});
      var $dataColorSelect = $('<input>', {class: "color-select color1"});
      
      $dataInputDiv.append($dataInputEl).append($dataColorSelect);;
      $datasets.append($dataInputDiv);
      colorSelector();
    }
    dataLinksStyle();
  }
  
  function removeDataSet(evt) {
    if (evt) {
      evt.preventDefault();
    }
    var dsArr = templateData.datasets;
    
    if(dsArr.length <= 2) {
      //console.log('must have at least two datasets'+ dsArr.length);      
      return;
    } 
    else {
      dsArr.pop();
      //Remove the html input element
      var $lastDataInputs = $('#datasets div.container').last();
      $lastDataInputs.remove();
    }
    dataLinksStyle();
  }
  
  //toggles hide and show of rm, add links accordingly
  function dataLinksStyle() {
    var tempp = templateData.datasets;
    //3, 4, 5, 6 both show
    if(tempp.length > 2 && tempp.length < 9) { 
      $rmDataBtn.removeClass('hidden'); 
      $addDataBtn.removeClass('hidden');
    }
    if(tempp.length === 2) { $rmDataBtn.addClass('hidden'); }
    if(tempp.length === 9) { $addDataBtn.addClass('hidden'); }  
  }
  
  function dataLinksStyle2() {
    var $rmSlice = $('#rm-slice'),
        $addSlice = $('#add-slice');
    
    var tempp = templateData2;
    // from 2 - 12, both show
    if(tempp.length > 2 && tempp.length < 13) { 
      $rmSlice.removeClass('hidden'); 
      $addSlice.removeClass('hidden');
    }
    if(tempp.length === 2) { $rmSlice.addClass('hidden'); }
    if(tempp.length === 12) { $addSlice.addClass('hidden'); }  
  }
  
  // Converts canvas to an image
  function canvasToImage() {
      var graph = document.getElementById('generated-chart');
      var image = new Image();
      image.src = graph.toDataURL("image/png");
      
      var $download = $('<a download="simplechart.png"></a>');
      $download.attr('href', image.src);
      $download.append(image);

      $('#graph-output').empty().append($download);
  }
  
	//Initiates the initial instance of the application, event bindings, ect..
	appInit();
  
	return {
		// Any methods to be returned for public consumption by other parts of the App

	};
	
})();

