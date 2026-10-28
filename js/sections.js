// Sezioni a scomparsa: Libri, Pubblicazioni, Docenze e Contatti sono visibili
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

	// extra: altre sezioni da aprire insieme a quella indicata (data-also sul link).
	function show(section, extra) {
		var open = [section].concat(extra || []);
		var all = sections();
		for (var i = 0; i < all.length; i++) {
			all[i].classList.toggle('is-open', !!section && open.indexOf(all[i]) !== -1);
		}
		var links = document.querySelectorAll('#menu a[href^="#"]');
		for (var j = 0; j < links.length; j++) {
			links[j].classList.toggle('is-active', !!section && open.indexOf(sectionFor(links[j].getAttribute('href'))) !== -1);
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
		var extra = [];
		var also = (link.getAttribute('data-also') || '').split(/\s+/);
		for (var k = 0; k < also.length; k++) {
			var other = sectionFor(also[k]);
			if (other) extra.push(other);
		}
		show(section, extra);
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
		// Se la sezione è già aperta (es. dal click), non chiudere quelle aperte insieme.
		var section = sectionFor(location.hash);
		if (section && !section.classList.contains('is-open')) show(section);
	});
})();
