$("#temas").click(function(){
	$("#temas span").toggleClass('arrow-up');
	$("#temas-list").slideToggle('slow');
});
$("#admin").click(function(){
	$("#admin span").toggleClass('arrow-up');
	$("#admin-list").slideToggle('slow');
});
$("#ciudades").click(function(){
	$("#ciudades span").toggleClass('arrow-up');
	$("#ciudades-list").slideToggle('slow');
});

$("#main").click(function() {
  $("#panel").toggleClass("open");
  $("#main").toggleClass("open");
  $("aside #back").toggleClass("open");
});

$("#sesion img").click(function() {
  $("#sesion").toggleClass("open");
});
