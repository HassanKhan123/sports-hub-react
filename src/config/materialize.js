import M from 'materialize-css';
// import $ from 'jquery'
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });
//   $(document).ready(function() {
//     $('select').formSelect();
// });