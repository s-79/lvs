$(document).ready(function () {

	// ------------------------------------------------------------------------ PLAYLISTS

	// ------------------------------------------------------------------------ Pour les playlists 1 à 5 on lance la fonction init (ci-dessous)
	for (let i = 1; i < 6; i++) {init(i);}

	function init(i){
		let current = 0;
		// -------------------------------------------------------------------- Création des variable spour appeler les div audio1 à audio5 et playlist1 à playlist5
		const audio = $(`#audio${i}`);
		const playlist = $(`#playlist${i}`);
		// -------------------------------------------------------------------- Pour la playlist en cours d'itération (1 à 5) récupération des morceaux qui sont dans les balises li a
		const tracks = playlist.find('li a');
		const len = tracks.length - 1;
		audio[0].volume = .50;
		// audio[0].play();
		// -------------------------------------------------------------------- Lorsqu'on clique sur une balise a dans la playlist
		playlist.on('click','a', function(e){
			e.preventDefault();
			link = $(this);
			current = link.parent().index();
			// ---------------------------------------------------------------- Lancement de la fonction run définie plus bas
			run(link, audio[0]);
		});
		// -------------------------------------------------------------------- Jouer automatiquement la piste suivante lorsque la précédente est finie (ended)
		audio[0].addEventListener('ended',function(e){
			current++;
			// ---------------------------------------------------------------- Si le morceau actuel est le dernier de la playlist (len = taille de la playlist)
			if(current == len){
				// ------------------------------------------------------------ On repart au début (0)
				current = 0;
				link = playlist.find('a')[0];
			}else{
				link = playlist.find('a')[current];
			}
			run($(link),audio[0]);
		});
	}
	function run(link, player){
			player.src = link.attr('href');
			par = link.parent();
			par.addClass('active').siblings().removeClass('active');
			// ---------------------------------------------------------------- Arréter les autres players
			for (let i = 1; i < 5; i++) {
				$(`#audio${i}`)[0].pause()
			};
			player.load();
			player.play();
	}

	// ------------------------------------------------------------------------ Remplir les playlists des albums et titres des modals
	$.ajax({
		dataType: "json",
		// -------------------------------------------------------------------- On récupère les données contenus dans le fichier json "albums"
		url: "./json/albums.json",
		success: function(response){
			const len = response.length;
			let play_jdtpt = "";
			let play_amtamv = "";
			let play_reprises = "";
			let play_inedits = "";
			let list_titres = "";
			// ----------------------------------------------------------------- On lance une itération sur chaque éléments du fichier
			for (let i = 0; i < len; i++) {
				// ------------------------------------------------------------- On récupère les données à chaque itération
				const album = response[i].album;
				const num = response[i].num;
				const titre = response[i].titre;
				const url = response[i].url;
				// ------------------------------------------------------------- On utilise les données récupérées pour remplir les playlists des albums
				if(album === "jdtpt") {
					if(num === "01") play_jdtpt += `<li class="active"><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;
					else {play_jdtpt += `<li><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;}
				}
				if(album === "amtamv") {
					if(num === "01") play_amtamv += `<li class="active"><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;
					else {play_amtamv += `<li><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;}
				}
				if(album === "reprises_live") {
					if(num === "01") play_reprises += `<li class="active"><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;
					else {play_reprises += `<li><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;}
				}
				if(album === "inedits_demos") {
					if(num === "01") play_inedits += `<li class="active"><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;
					else {play_inedits += `<li><a href="https://lesvieillessalopes.com/ogg/${url}">${num}. ${titre}</a></li>`;}
				}
			}
			// ---------------------------------------------------------------- On affiche les éléments récupérés sur la page
			$("#playlist1").html(play_jdtpt);
			$("#playlist2").html(play_amtamv);
			$("#playlist3").html(play_reprises);
			$("#playlist4").html(play_inedits);
		}
	});

	// ------------------------------------------------------------------------ PAROLES

	// ------------------------------------------------------------------------ Remplir la liste des titres de jdtpt dans le modal lors du clic sur "Paroles"
	// ------------------------------------------------------------------------ Ce qui permet de ne pas le remplir inutilement au démarrage mais seulement si l'utilisateur en a beson
	// ------------------------------------------------------------------------ Peret aussi d'utiliser un seul modal en html et de le remplir si besoin
	$("#par_jdtpt, #par_amtamv").click(function() {
		let albumClicked = $(this).attr('id');
		albumClicked = albumClicked.split("par_");
		albumClicked = albumClicked[1];
		// -------------------------------------------------------------------- On adapte le titre en fonction de l'album qui a été cliqué
		if(albumClicked === "jdtpt") $("#modalTitle").text("Jamais debout, toujours par terre");
		if(albumClicked === "amtamv") $("#modalTitle").text("Aime-moi tendre, aime-moi vrai");
		$.ajax({
			dataType: "json",
			// ---------------------------------------------------------------- On récupère les données contenus dans le fichier json "albums"
			url: "./json/albums.json",
			success: function(response){
				const len = response.length;
				let play_jdtpt = "";
				let play_amtamv = "";
				let play_reprises = "";
				let play_inedits = "";
				let list_titres = "";
				for (let i = 0; i < len; i++) {
					const album = response[i].album;
					const num = response[i].num;
					const titre = response[i].titre;
					// -------------------------------------------------------- Les fichier "Intro" n'ont pas de paroles, donc on ne les récupère pas
					if(titre !== "Intro") {
						// -----------------------------------------------------Si la chanson en cours d'itération appartient à l'album sur lequel l'utilisateur à cliqué
						if(album === albumClicked) {
							// ------------------------------------------------ On récupère ses infos et on les mets en forme
							list_titres += `<div id="t_${album}${num}" class="titre">${num}. ${titre}<br></div>`;
							list_titres += `<div id="p_${album}${num}" class="paroles d-none ps-3"></div>`;
						}
					}
				}
				$("#modalBody").removeClass("text-center");
				// ------------------------------------------------------------ On affiche la liste des titres récupérés dans le body du modal
				$("#modalBody").html(list_titres);
				$("#modal").modal('show');
			}
		});
	});
	// ------------------------------------------------------------------------ Afficher les paroles lorsqu'on clique sur un titre
	$("body").delegate( ".titre", "click", function() {
		// -------------------------------------------------------------------- On enlève la class rouge de chaque titre (ça ne le ferra que sur celui qui était actif)
		$(".titre").removeClass("rouge");
		// -------------------------------------------------------------------- "This" c'est le morceau cliqué, on lui ajoute donc la class rouge
		$(this).addClass("rouge");
		// -------------------------------------------------------------------- On récupère l'id du mrceau cliqué (This)
		let id_Titre = $(this).attr('id');
		// -------------------------------------------------------------------- L'id aura la forme t_0, on sépare donc le t_ du numéro de la piste
		id_Titre = id_Titre.split("t_");
		// -------------------------------------------------------------------- Split met les 2 parties séparée dans un tableu, dont on ne veut que la seconde valeur [1]
		id_Titre = id_Titre[1];
		// -------------------------------------------------------------------- On donne à la variable le nom de la div qui contient les paroles #p_ et on y ajoute le numéro de la piste cliquée
		const id_Paroles = `#p_${id_Titre}`;
		// -------------------------------------------------------------------- On récupère le display (none, block...) du morceau cliqué
		const disp_Paroles = $(id_Paroles).css("display");
		// -------------------------------------------------------------------- On cache toutes les div qui contiennent des paroles
		$(".paroles").addClass("d-none");
		const id_Load = `paroles/p_${id_Titre}.html`;
		// -------------------------------------------------------------------- Si avant de cacher la div, celle-ci était visible (block), on enlève la class d-block - Donc on cache les paroles lors d'un second cliqu sur le titre
		if (disp_Paroles === "block") $(id_Paroles).removeClass("d-block");
		// // ----------------------------------------------------------------- Sinon, on affiche les paroles
		else {
			$(id_Paroles).load(id_Load);
			$(id_Paroles).removeClass("d-none");
		}

		// --------------------------------------------------------------------- Enlever le rouge et cacher les paroles à la fermeture du modal
		$('.modal').on('hidden.bs.modal', function () {
	  		$(".titre").removeClass("rouge");
			$(".paroles").addClass("d-none");
		})
	});

	// ------------------------------------------------------------------------ COMMANDER

	// ------------------------------------------------------------------------ Remplir la liste des titres de jdtpt dans le modal lors du clic sur "Paroles"
	$("#commander").click(function() {
		$("#modalTitle").text("Commander");
		let commander = `Il nous reste encore quelques exemplaires de<br>`
		commander += `<span class="fw-bold">→ Jamais debout toujours par terre ←</span><br><br>`
		commander += `Prix libre + 3€ de frais de port<br>ou directement en main propre sur Paris<br><br>`
		commander += `<a href="mailto:seb@lesvieillessalopes.com">Envoyez-moi un mail pour + d'infos<br>seb[at]lesvieillessalopes.com</a>`
 		$("#modalBody").html(commander);
		$("#modalBody").addClass("text-center");
 		$("#modal").modal('show');
	});

	// ------------------------------------------------------------------------ VIDÉOS

	// ------------------------------------------------------------------------ Remplissage
	$.ajax({
		dataType: "json",
		// -------------------------------------------------------------------- On récupère les données contenus dans le fichier json "vidéos"
		url: "./json/videos.json",
		success: function(response){
			const len = response.length;
			let plVid = "";
			// ----------------------------------------------------------------- On lance une itération sur chaque éléments du fichier
			for (let i = 0; i < len; i++) {
				const num = response[i].num;
				const titre = response[i].titre;
				const lien = response[i].lien;
				// ------------------------------------------------------------ On met en forme les données récupéré à chaque itération
				plVid += `<li id="v${i}" class="video"><a href="https://lesvieillessalopes.com/mp4/${lien}">${num}. ${titre}</a></li>`;
			}
			// ---------------------------------------------------------------- On affiche les données mises en forme dans la playlist5 : Vidéo
			$("#playlist5").html(plVid);
			// ---------------------------------------------------------------- Le 1er morceau prend la class active : Il est rouge et c'est le morceau chargé dans le player
			$("#v0").addClass("active");

			// ----------------------------------------------------------------- Afficher les infos de la vidéo lors du clic
			$("body").delegate( ".video", "click", function() {
				// ------------------------------------------------------------ On récupère l'id du titre de la vidéo cliquée
				let id_Vid = $(this).attr('id');
				// ------------------------------------------------------------ On sépare l'id en 2 après le v et on récupère le numéro de la piste
				id_Vid = id_Vid.split("v");
				id_Vid = id_Vid[1];
				// ------------------------------------------------------------ On va chercher dans le fichier json, le titre et les infos qui correspondent à cette vidéo
				const titreInfo = response[id_Vid].titre;
				const infos = response[id_Vid].infos;
				// ------------------------------------------------------------ On les met en forme
				const infoVid = `<span class="albumPipe pe-2 fw-bold text-white pe-2">→</span><span class="rouge pe-2">${titreInfo}</span> le ${infos}`;
				// ------------------------------------------------------------ On vide la div puis on la remplit avec les infos mises en forme
				$("#videos").html("");
				$("#videos").html(infoVid);
			});

			// ----------------------------------------------------------------- Afficher les infos de la piste suivante jouées automatiquement
			const video = $(`#audio5`);
			// ----------------------------------------------------------------- Lorsqu'une video se termine (ended), on lance une itération sur la liste de 50 vidéos
			video[0].addEventListener('ended',function(e){
				for (let i = 0; i < 50; i++) {
					// --------------------------------------------------------- On créé une variable du nom de la div à chacune des 50 itérations
					const vid = `#v${i}`;
					// --------------------------------------------------------- On vérifie si la div itérée possède la classe active
					const active = $(vid).hasClass('active');
					// --------------------------------------------------------- Si oui c'est qu'il s'agit du morceau en cours de visionnage, on va donc récupérer ses infos
					if (active) {
						const titreInfo = response[i].titre;
						const infos = response[i].infos;
						// ----------------------------------------------------- On met en forme les infos récupérés
						const infoVid = `<span class="albumPipe pe-2 fw-bold text-white pe-2">→</span><span class="rouge pe-2">${titreInfo}</span> le ${infos}`;
						// ----------------------------------------------------- On vide la divet on y affiche les infos mises en formes
						$("#infoVid").html("");
						$("#infoVid").html(infoVid);
					};
				}
			});
		}
	});

	// ------------------------------------------------------------------------ CONCERTS

	// ------------------------------------------------------------------------ Remplir la liste des concerts
	$.ajax({
		dataType: "json",
		// -------------------------------------------------------------------- On récupère les données contenus dans le fichier json "dates"
		url: "./json/dates.json",
		success: function(response){
			const len = response.length;
			let plConcert = "";
			// ----------------------------------------------------------------- On lance une itération sur chaque élément du fichier pour récupérer les infos
			for (let i = 0; i < len; i++) {
				const date = response[i].date;
				const ville = response[i].ville;
				// ------------------------------------------------------------- On met en forme les infos récupérées pour remplir la playlist
				plConcert += `<li id="c${i}" class="concert">${date} - ${ville}</li>`;
			}
			// ---------------------------------------------------------------- On affiche dans la playlist sur la page
			$("#playlist6").html(plConcert);

			// ----------------------------------------------------------------- Placement du Scroll sur la date au Picolo et affichage en rouge
			const element = document.getElementById("pl_Concert");
			element.scrollBy(0,450);
			$("#c24").addClass("active");

			// ----------------------------------------------------------------- Afficher les infos du concert lors du clic
			$("body").delegate( ".concert", "click", function() {
				// ------------------------------------------------------------- On récupère l'id de la date de concert cliquée et on lui enlève sa class active
				let id_Concert = $(this).attr('id');
				$(".concert").removeClass("active");
				id_Concert = `#${id_Concert}`
				$(id_Concert).addClass("active");
				// ------------------------------------------------------------- L'id contient #c avant le nyuméro du concert, on va donc splitté en 2 et récupérer le numéro du concert : [0] = #c , [1] = numéro
				id_Concert = id_Concert.split("#c");
				id_Concert = id_Concert[1];
				// ------------------------------------------------------------- Avec le numéro de concert récupéré, on va chercher ses infos
				const lieu_Concert = response[id_Concert].lieu;
				const groupes_Concert = response[id_Concert].groupes;
				// ------------------------------------------------------------- On les met en forme
				let infoConcert = `<span class="fw-bold pe-2">→</span><span class="rouge">${lieu_Concert}</span>`;
				if(groupes_Concert !=="") infoConcert += ` avec ${groupes_Concert}`;
				// ------------------------------------------------------------- On les affiche à côté du titre, après avoir vidé la div
				$("#concerts").html("");
				$("#concerts").html(infoConcert);
				// ------------------------------------------------------------- Afficher le flyer du concert lors du clic
				// ------------------------------------------------------------- Avec le numéro de concert récupéré, on va chercher son numéro de flyer (qui correspond à la date du concert)
				let flyer_Concert = response[id_Concert].flyer;
				// ------------------------------------------------------------ Si le fichier json contient une valeur (donc n'est pas vide !=="" => vide) on prend la date du concert et on ajoute .jpg pour avoir le nom de l'image.
				if(flyer_Concert !=="") {
					flyer_Concert = `<img class="img-fluid border border-1 border-light" src="img/concerts/${flyer_Concert}.jpg" alt="${flyer_Concert}">`;
				// ------------------------------------------------------------ S'il n'y a pas de numéro de flyer, c'est qu'il n'y a pas de flyer; on affiche alors l'image noFly
				} else {
					flyer_Concert = `<img class="img-fluid border border-1 border-light" src="img/concerts/noFly.jpg" alt="Pas de flyer pour ce concert">`;
				}
				// ------------------------------------------------------------ On vide la div qui contient les flyers et on affiche l'image mis en forme au dessus
				$("#flyer").html("");
				$("#flyer").html(flyer_Concert);
			});
		}
	});
});
