window.app = {};
var vinoModel = Backbone.Model.extend({
	defaults:{
		name: '',
		year: '',
		grapes:'',
		country:'',
		region:'',
		description:'',
		picture:''
	},
	
});
var vinoCollection = Backbone.Collection.extend({
	model: vinoModel,
	url:'api/wines'
});
var listavinos = Backbone.View.extend({
	modelo: vinoCollection,
	vino: null,
	template:'home',
	m:null,
	events:{
		'click .add':'add',
		'click .del':'del',
		'submit #form form':'save',
		'click .edit':'edit'
	},
	initialize: function(){
		_.bindAll(this);
		this.vino = new this.modelo();
		this.vino.on('add',function(e){
			this.fetch();
		});
		this.vino.on('reset',this.render);
		this.vino.fetch();
		//this.vino.bind("reset", this.render, this);
		this.vino.on('remove',function(el){
			$("[data-id='"+el.id+"']").parents('li:first').remove();
		});
	},
	render:function(){
		console.log("render");
		this.$el.html('');
		this.$el.mustache(this.template,{
		items:this.vino.models,
		});
	},
	save:function(e){
		e.preventDefault();
		var form = $(e.currentTarget).serializeArray();
		var m = this.m;
		_.each(form,function(e){
			m.set(e.name,e.value);
		});
		if (m.isNew()) {
            this.vino.create(m,{wait:true});
        } else {
            m.save();
        }
		$('#form').modal('hide');
	},
	add:function(ev){
		this.m = new vinoModel();
	},
	edit:function(ev){
		console.log($(ev.currentTarget).data('id'));
		this.m = this.vino.get($(ev.currentTarget).data('id'));
		$('#wineId').val(this.m.get('id'));
		$('#name').val(this.m.get('name'));
		$('#grapes').val(this.m.get('grapes'));
		$('#country').val(this.m.get('country'));
		$('#region').val(this.m.get('region'));
		$('#year').val(this.m.get('year'));
		$('#form').modal('show');
		
	},
	del: function(ev){
		//currentTarget
		var modelo = this.vino.get($(ev.currentTarget).data('id'));
		modelo.destroy();
		this.vino.remove($(ev.currentTarget).data('id'));
	}
});
var itemvino=Backbone.View.extend({
	modelo: vinoModel,
	vino: null,
	template:'item',
	events:{
		'click .del':'del'
	},
	initialize: function(){
		_.bindAll(this);
		this.vino = new this.modelo();
		this.vino.on('change',this.render);
		this.vino.on('reset',this.render);
		this.vino.fetch();
		//this.vino.bind("reset", this.render, this);
		this.vino.on('destroy',function(el){
			alert(el);
		});
	},
	render:function(){
		console.log("render");
		this.$el.mustache(this.template,{
		items:this.vino.models,
		});
	},
	del: function(ev){
		//currentTarget
		var modelo = this.vino.get($(ev.currentTarget).data('id'));
		modelo.destroy();
		this.vino.remove($(ev.currentTarget).data('id'));
	}
});
$(document).ready(function () {
    console.log('document ready');
	$.Mustache.addFromDom();

	window.app.ListaVinos = new listavinos({
		el: '#content',
	});
});