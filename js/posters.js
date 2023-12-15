class PosterDialog {
    constructor() {
        this.dialog = document.getElementById('poster-dialog');
        for (let el of document.querySelectorAll('a.image'))
            el.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let imgElement = evt.target;
        if (evt.target.tagName !== 'IMG')
            imgElement = evt.target.querySelector('img');
        const figureElement = this.dialog.querySelector('figure');

        while (figureElement.lastElementChild)
            figureElement.lastElementChild.remove();
        figureElement.append(imgElement.cloneNode());

        const titleElement = this.dialog.querySelector('.image-title');
        titleElement.textContent = imgElement.title;
        this.dialog.showModal();
    }
}

class PosterNavigation {
    constructor() {
        this.element = document.querySelector('nav');
        this.element.hidden = false;

        this.labelElement = this.element.querySelector('[data-label]');

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {threshold: 0.5}
        );

        this.posters = [...document.querySelectorAll('.poster')];
        for (const poster of this.posters)
            this.observer.observe(poster);

        this.nextButton = this.element.querySelector('[data-next]');
        this.previousButton = this.element.querySelector('[data-previous]');

        this.nextButton.addEventListener('click', this.handleNext.bind(this));
        this.previousButton.addEventListener('click', this.handlePrevious.bind(this));
    }

    handleIntersection(entries) {
        for (const entry of entries) {
            if (entry.intersectionRatio > .5) {
                this.current = entry.target;
                this.labelElement.textContent = this.current.dataset.label;
                history.replaceState(null, '', '#' + this.current.id);
                this.previousButton.disabled = false;
                this.nextButton.disabled = false;
                if (this.currentIdx == 0)
                    this.previousButton.disabled = true;
                if (this.currentIdx == this.posters.length - 1)
                    this.nextButton.disabled = true;
            }
        }
    }

    handleNext() {
        const nextIdx = Math.min(this.currentIdx + 1, this.posters.length - 1);
        this.current = this.posters[nextIdx];
        window.location.href = '#' + this.current.id;
    }

    handlePrevious() {
        const previousIdx = Math.max(this.currentIdx - 1, 0);
        this.current = this.posters[previousIdx];
        window.location.href = '#' + this.current.id;
    }

    get currentIdx() {
        if (!this.current)
            this.current = this.posters[0];
        return this.posters.indexOf(this.current);
    }
}

new PosterNavigation();
new PosterDialog();
