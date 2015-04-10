var dashboard = undefined;

var loadDashboard = function()
{
  dashboard = new Dashboard("dashboard");
  dashboard.enableAnimations = true;
}

$(document).ready(function()
{
  loadDashboard();
});
