import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem'); // Add ARIA role for list item
    li.setAttribute('tabindex', '0'); // Make the card focusable
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')){
        div.className = 'cards-card-image';
        const img = div.querySelector('img');
        if (img && !img.alt) {
          img.alt = 'Image of ' + (li.querySelector('.cards-card-body p')?.textContent || 'Region');
        }
      } 
      else{
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
  ul.setAttribute('role', 'list');
  ul.setAttribute('aria-label', 'Regions list'); // Adds meaningful context for screen readers
}
