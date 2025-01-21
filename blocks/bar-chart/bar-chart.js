export default async function decorate(block) {
    const form = document.createElement('form');
    const labels = block.querySelectorAll(':scope > div div p');
    const formContent = await fetch('average-weather.json')
      .then((res) => res.json())
      .then(({ data }) => data)
      .catch((err) => console.error("Couldn't load form content", err));

    console.log(formContent);
  
    formContent.forEach((field, i) => createField(form, field, labels[i]));
    block.textContent = '';
    block.append(form);
}