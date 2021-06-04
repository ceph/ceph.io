module.exports = (id, title = 'YouTube video player') => {
  return `
  <div class="aspect-ratio aspect-ratio--16x9">
    <iframe 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
      height="405"
      src="https://www.youtube.com/embed/${id}"
      title="${title}"
      width="720"
    >
    </iframe>
  </div>
  `;
};
