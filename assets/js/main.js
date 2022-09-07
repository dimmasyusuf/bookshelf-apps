// OVERLAY FORM
const openForm = document.getElementById('openForm');

openForm.addEventListener('click', function () {
  document.getElementById('overlayForm').style.display = 'flex';
}
);

const closeForm = document.getElementById('closeForm')

closeForm.addEventListener('click', function () {
  document.getElementById('overlayForm').style.display = 'none'
}
);

