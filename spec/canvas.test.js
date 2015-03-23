var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Canvas Utility Functions', function() {

  this.timeout(4000);

  describe('appendCanvasElement', function(){
    it('should append one canvas element the body', function(){
      var hasCanvas = page.evaluate(function() {
        appendCanvasElement()
        return document.getElementById('graffeo-canvas') !== null
      });
      expect(hasCanvas).to.equal(true);  
    });
  });

  describe('addImage', function(){

    it('should add image to canvas at mouse click position', function(){
    });
  });

  describe('clearUserCanvas', function(){

    it('should erase everything drawn on user canvas', function(){
    });
  });

  describe('findxy', function(){

    it('should have all the necessary methods', function(){
    });
  });

  describe('drawLine', function(){
   it('should have all the necessary methods', function(){
   });
  });

  describe('drawCanvasElement', function(){

    it('should draw correct image on user canvas', function(){
    });
  });

  describe('removeGraffeoCanvasAll', function(){

    it('should remove all graffeo canvas elements from body', function(){
    });
  });
});

describe('General Utility Functions', function() {

  describe('turnEditOn', function(){

    it('should make user canvas editable', function(){
    });
  });

  describe('turnEditOff', function(){

    it('should make user canvas uneditable', function(){
    });
  });

  describe('addOneTimeClickEvent', function(){

    it('should add one time click event to canvas', function(){
    });
  });
});

describe('Message Handling', function() {

  describe('Toggling Messages', function(){

    describe('Toggle On', function(){
      it('on request, should run turnEditOn function', function(){
       
      });
    });

    describe('Toggle Off', function(){
      it('on request, should run turnEditOff function', function(){
       
      });
    });
  });

  describe('Get Status Messages', function(){

    it('on request, should respond with proper togggle status', function(){
     
    });
  });

  describe('Get Token Messages', function(){

    it('on request, should respond with proper togggle status', function(){
     
    });
  });

  describe('Add Image Messages', function(){

    it('on request, should add one-time click event to canvas', function(){
     
    });
  });


  describe('Token Update Messages', function(){

    it('on request, should log user out when token is null', function(){
     
    });

    it('on request, should log user in when token is present', function(){
     
    });
  });

  describe('Erase Canvas Messages', function(){

    it('on request, should call erase canvas function', function(){
     
    });
  });

  describe('Color Change Messages', function(){

    it('on request, should change pen color', function(){
     
    });
  });
});