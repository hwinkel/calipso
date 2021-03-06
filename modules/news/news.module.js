var calipso = require("../../lib/calipso");      

exports = module.exports = {init: init, route: route};

/**
 * Base news module
 * 
 * @param req      request object
 * @param menu     menu response object
 * @param blocks   blocks response object
 * @param db       database reference
 */
function route(req,res,module,app,next) {      

      
  
      /**
       * Routes
       */   
     module.router.route(req,res,next);
      
};


function init(module,app,next) {       
    
  calipso.lib.step(
      function defineRoutes() {
        module.router.addRoute(/.*/,breakingNews,{end:false, template:'breaking',block:'news.breaking'},this.parallel());
      },
      function done() {
        next();
      }        
  );
                  
};

function breakingNews(req,res,template,block,next) {      
  
    // Create a new news block
    res.blocks.news = [];
    var Content = calipso.lib.mongoose.model('Content');
    
    Content.find({tags:'breaking'})
      .sort('created', -1)
      .skip(0).limit(5)          
      .find(function (err, contents) {
            
            var news = [];
            contents.forEach(function(c) {              
              var item = {id:c._id,type:'content',meta:c.toObject()};
              news.push(item);
            });
            
            calipso.theme.renderItem(req,res,template,block,{news:news});
            
            next();
    });
      
};