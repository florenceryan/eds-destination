export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Set up image and text columns with accessibility enhancements
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index, colsArray) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // Picture is the only content in the column
          picWrapper.classList.add('columns-img-col');

          // Add meaningful alt text to images
          const img = pic.querySelector('img');
          if (img && !img.alt) {
            const textCol = colsArray[index + 1];
            const heading = textCol?.querySelector('h3')?.textContent || 'Image';
            img.alt = `Image of ${heading}`;
          }

          // Set up the next column as the text column
          const nextCol = colsArray[index + 1];
          if (nextCol) {
            nextCol.classList.add('columns-text-col');
          }
        }
      }
    });
  });

  // Make each column focusable and add keyboard navigation
  [...block.querySelectorAll('.columns-text-col')].forEach((textCol) => {
    textCol.setAttribute('tabindex', '0'); // Make the text column focusable
    textCol.setAttribute('role', 'region');
    textCol.setAttribute('aria-labelledby', textCol.querySelector('h3')?.id || ''); // Associate with heading
  });

  // Add roles and labels for the block container
  block.setAttribute('role', 'list');
  block.setAttribute('aria-label', 'Portugal destinations'); // Provide meaningful context for screen readers
  
}
