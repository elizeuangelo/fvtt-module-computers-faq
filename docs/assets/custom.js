// First visits use phosphor-dark; explicit TypeDoc theme preferences still win.
if (localStorage.getItem("tsd-theme") === null) {
  document.documentElement.dataset.theme = "dark";
  const theme = document.getElementById("tsd-theme");
  if (theme) theme.value = "dark";
}
