$(function() {

  var currentPicture = -1;
  var totalpictures = $('#mainDiv img').size();
  var showGallerySpeed = 500; // ms
  var nextPictureSpeed = 700; // ms
  
  // Resize picture when user resizes the window
  $(window).bind('resize', function() {
      var $picture = $('#galleryContent').find('img');
      resize($picture);
  });
  
  // Start with the mainDiv in full view...
  $('#mainDiv').css({'height':'100%'}); 
  $('#mainDiv').show();
  
  // ...and the galleryDiv collapsed.
  $('#galleryDiv').css({'height':'0px'}); 
  $('#galleryDiv').hide();
  
  // Barely highlight the current selected picture on the mainDiv 
  //$('#mainContent > img').hover(function () {
  //    var $this   = $(this);
  //    $this.stop().animate({'opacity':'1.0'},100);
  //},function () {
  //    var $this   = $(this);
  //    $this.stop().animate({'opacity':'0.9'},100);
  //});
  
  // Launch the gallery when the user clicks on an image 
  // on the mainDiv/content section ...
  $('#mainContent').find('img').bind('click', function() {

    var $this = $(this);

    // ...create an image tag (notice that at this point is an orphan element)
    $('<img id="bigphoto" />').load(function(){

      // ...send the mainDiv to the back...
      $('#mainDiv').css({'z-index':'0'});  

      // ...bring the galleryDiv to the front...
      $('#galleryDiv:hidden').show();
      $('#galleryDiv').css({'z-index':'100'});

      currentPicture = $this.index('img');
      var $theImage = $(this);

      resize($theImage);

      // ...link the new/orphan image tag to the galleryContent div.
      $('#galleryContent').append($theImage);
      $theImage.fadeIn(nextPictureSpeed);

      // ...resize the galleryDiv to take over the screen...
      $('#galleryDiv').animate({'height':'100%'},showGallerySpeed,function(){

        // ...collapse the mainDiv
        $('#mainDiv').css({'height':'0px'}); 
        
        // enable the previous button (if needed)
        navigationButtons(currentPicture, totalpictures);
            
        // enable the close button
        $('#closeButton').fadeIn();
        
      }); // animate

    }).attr('src', $this.attr('alt'));
    
    // Wire the next/previous/close buttons
    $('#next').bind('click',function(){
        var $this           = $(this);
        var $nextimage 		= $('#container img:eq(' + (currentPicture+1) + ')');
        navigate($nextimage,'right');
    });
    
    $('#prev').bind('click',function(){
        var $this           = $(this);
        var $previmage 		= $('#container img:eq(' + (currentPicture-1) + ')');
        navigate($previmage,'left');
    });
    
    $('#closeButton').bind('click', function(){
        $('#galleryContent > img').click();	/* simulates click on large photo */
    });
                    
  }); // $('#container > img').bind('click')

  // Bring back the mainDiv when the user clicks on the picture in the gallery
  // (notice that we use live instead of bind because the image is not added
  // until the user clicks on.)
  $('#galleryContent > img').live('click', function() {

    $this = $(this);

    // ...send the gallery to the back...
    $('#galleryDiv').css({'z-index':'0'});
    
    // ...bring the mainDiv to the front...
    $('#mainDiv').css({'z-index':'100'});

    // ...resize the mainDiv to take over the screen...
    $('#mainDiv').animate({'height':'100%'},showGallerySpeed,function(){
       
       // blow away the dynamic element added for the photo
       // TODO: figure out why $('#bigphoto').remove(); does not work here?
       $this.remove();
       
       // hide and un-wire the navigation buttons
       $('#prev').unbind('click');
       $('#next').unbind('click');
       $('#closeButton').unbind('click');
       
       $('#prev').hide();
       $('#next').hide();
       $('#closeButton').hide();
       
       // ...and or course, collapse the galleryDiv
      $('#galleryDiv').css({'height':'0px'}); 
      
    }); // animate

  }); // $('#galleryContent > img').live('click')

  // Given the next or previous image to show,
  // and the direction, it loads a new image in the panel
  // (TODO: There is some code duplication here witht the code
  // above to load the image initially. Can this be optimized?)
  function navigate($nextimage,dir){

      if(dir=='left' && currentPicture==0)
          return;
      if(dir=='right' && currentPicture==parseInt(totalpictures-1))
          return;

      // ...create an image tag (notice that at this point is an orphan element)
      $('<img/>').load(function(){
        
           var $theImage = $(this);
           //$('#loading').hide();
           //$('#description').empty().fadeOut();
            
           $('#galleryContent img').stop().fadeOut(500,function(){
               
               // Remove the current image in the gallery
               var $this = $(this);
               $this.remove();
               
               resize($theImage);
               
               // ...link the new/orphan image tag to the galleryContent div.
               $('#galleryContent').append($theImage.show());
               $theImage.stop().fadeIn(800);

               //var title = $nextimage.attr('title');
               //if(title != ''){
               //   $('#description').html(title).show();
               //}
               //else
               //     $('#description').empty().hide();

               navigationButtons(currentPicture, totalpictures);
           });
           
           if(dir=='right')
               ++currentPicture;
           else if(dir=='left')
               --currentPicture;

       }).attr('src', $nextimage.attr('alt'));

  } // navigate
  
  function navigationButtons(current, totalpictures) {
    if(current==0)
        $('#prev').hide();
    else
        $('#prev').show();
        
    if(current==parseInt(totalpictures-1))
        $('#next').hide();
    else
        $('#next').show();        
  } // navigationButtons()

  // Resizes the given image to fit nicely in the current window size
  function resize($image){
    var windowH      = $(window).height()-100;
    var windowW      = $(window).width()-80;
    var theImage     = new Image();
    theImage.src     = $image.attr("src");
    var imgwidth     = theImage.width;
    var imgheight    = theImage.height;

    if((imgwidth > windowW)||(imgheight > windowH)){
      if(imgwidth > imgheight){
        var newwidth = windowW;
        var ratio = imgwidth / windowW;
        var newheight = imgheight / ratio;
        theImage.height = newheight;
        theImage.width= newwidth;
        if(newheight>windowH){
          var newnewheight = windowH;
          var newratio = newheight/windowH;
          var newnewwidth =newwidth/newratio;
          theImage.width = newnewwidth;
          theImage.height= newnewheight;
        }
      }
      else{
        var newheight = windowH;
        var ratio = imgheight / windowH;
        var newwidth = imgwidth / ratio;
        theImage.height = newheight;
        theImage.width= newwidth;
        if(newwidth>windowW){
          var newnewwidth = windowW;
          var newratio = newwidth/windowW;
          var newnewheight =newheight/newratio;
          theImage.height = newnewheight;
          theImage.width= newnewwidth;
        }
      }
    }
    $image.css({'width':theImage.width+'px','height':theImage.height+'px'});
  } // resize()

}); // Picture gallery 
