//Features of web application:
//Users should be able to fill in forms data and make a variety of charts; Line, bar, pie, 

/* Notes and tips for myself / Lessons learned from this project.

*Sometimes Jquery Object do not mix with pure javascript objects, spent over an hour trying to figure
out why $('#someEl').checked keeps returning undefined,
you need to do $('#someEl').prop('checked') to return a true/false value;

*When doing conditional comparisons, make SURE not to confuse assignment(=) with equals(== / ===), wasted an hour on this issue today. C'mon..

*Javascript, Jquery becomes a huge pain the larger the script file gets. For large applications, framesworks are pretty much required.  

*/
/*  Goals today
Major things left to do:
1. Verification
2. Scale to other kinds of graphs
3. Image output
4. App complete - check for errors


Make the layout completely optimize for mobile / responsive (especially the graph canvas) 	[k]
Fixed the dataset archetecture to support multiple datasets, and                          	[k]
build the ui html to allow the user to enter multiple datasets                            	[k]
be able to render the graph using additional datasets                                     	[k]
clean up the code a little                                                                	[k]
make some ui friendly changes to add, rm dataset links                                    	[k]
fix the jump default actions from clicking the links                                      	[k]
Adding support for selecting colors:
we can use the spectrum js library for the color pallete                                  	[k]
the view and then the logic                                                               	[k]
if the user forgets to enter in the labels, the system 
should provide a default so the graph can dispay display 
properly                                                                                  	[k]
tidy up the code and format a bit, mb jshint it                                           	[k]
implement the chart type for Bar, Radar first because
the data structure is pretty much the same                                                	[k]
make the chart type switch work for mobile selection nav also                             	[k]
implement the polar, pie, doughnut chart types, the data structure is
different and the options too... Finish                                                   	[k]
implements view for type2 charts															[k]
checking for errors and refactor    			 											[k]
error handling for type2 charts     														[k]
css styles changes (sass)          			 												[k]
research and implement image output from canvas   											[k]

Left:

	-code
		 -Refactor, think about errors, improvements
		 
	-Html
		-meta tags
		-Google Antalytics
		-favicon

	-Workflow
		-bring gulpjs in and automate things
		-git commit
	
	-Upload
		-research where to upload a webapp (own server or other)

*/

/* blog post */

###Premise
---
I wanted to do some data visualation work recently and was glad to find out there was no lack of Javascript libraries to help with it; d3.js, raphealjs, among the many.  But for my specific needs, I wanted to use something lighter and simpler.

I came across Chart.js.  Chart.js is a library for making charts easy using the HTML5 canvas.  You would provide it 3 things, 

*code here*










###Execution
---








