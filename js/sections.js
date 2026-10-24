// Sezioni a scomparsa: Pubblicazioni, Formazione e Contatti sono visibili
// solo dopo aver selezionato il relativo pulsante del menu.
(function () {
	var root = document.documentElement;
	root.className += ' js-sections';

	function sections() {
		return document.querySelectorAll('.toggle-section');
	}

	// Sezione a scomparsa che contiene l'ancora indicata (id o name).
	function sectionFor(hash) {
		var name = decodeURIComponent((hash || '').replace(/^#/, ''));
		if (!name) return null;
		var target = document.getElementById(name) || document.getElementsByName(name)[0];
		while (target && target !== document) {
			if (target.classList && target.classList.contains('toggle-section')) return target;
			target = target.parentNode;
		}
		return null;
	}

	function show(section) {
		var all = sections();
		for (var i = 0; i < all.length; i++) {
			all[i].classList.toggle('is-open', all[i] === section);
		}
		var links = document.querySelectorAll('#menu a[href^="#"]');
		for (var j = 0; j < links.length; j++) {
			links[j].classList.toggle('is-active', !!section && sectionFor(links[j].getAttribute('href')) === section);
		}
	}

	// Fase di cattura: la sezione si apre prima che il browser (o SmoothScroll)
	// calcoli la posizione dell'ancora.
	document.addEventListener('click', function (event) {
		var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
		if (!link) return;
		var section = sectionFor(link.getAttribute('href'));
		if (!section) return;
		var inMenu = !!link.closest('#menu');
		if (inMenu && section.classList.contains('is-open')) {
			event.preventDefault();
			event.stopPropagation();
			show(null);
			return;
		}
		show(section);
	}, true);

	function openFromHash() {
		var section = sectionFor(location.hash);
		if (!section) return;
		show(section);
		var name = decodeURIComponent(location.hash.slice(1));
		var target = document.getElementById(name) || document.getElementsByName(name)[0];
		if (target) target.scrollIntoView();
	}

	document.addEventListener('DOMContentLoaded', openFromHash);
	window.addEventListener('hashchange', function () {
		var section = sectionFor(location.hash);
		if (section) show(section);
	});
})();
