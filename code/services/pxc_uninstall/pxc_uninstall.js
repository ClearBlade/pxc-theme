/**
 * @typedef {{prefix: string, entity_id: string, component_id: string}} UninstallParams
 * @param {CbServer.BasicReq & {params: UninstallParams}} req
 * @param {CbServer.Resp} resp
 */
 function pxc_uninstall(req, resp) {
  
  var params = req.params;
  var entity_id = params.entity_id;
  var component_id = params.component_id;
  var systemKey = "deefb9fb0ca0bdcd8d93fddce09a01"; 
  var userToken = req.userToken;
  var baseUrl = "https://demo.clearblade.com/api/v/1/collection/" + systemKey + "/custom_settings";
  var brandQuery = "brand";
  var brandUrl = baseUrl + brandQuery;

  var deleteOptions = {
      method: "DELETE",
      headers: {
          "ClearBlade-UserToken": userToken
      }
  };

  fetch(brandUrl, deleteOptions)
      .then(function (response) {
          if (!response.ok) {
              throw new Error("Failed to delete branding data: " + response.statusText);
          }
          return response.json();
      })
      .then(function (responseData) {
          log("Branding data deleted successfully: " + JSON.stringify(responseData));
          deleteThemeData();
      })
      .catch(function (error) {
          log("Error deleting branding data: " + JSON.stringify(error));
          deleteThemeData();
      });

  function deleteThemeData() {
      var themeQuery = "entity_id" + encodeURIComponent(entity_id) + "component_id" + encodeURIComponent(component_id);
      var themeUrl = baseUrl + themeQuery;

      fetch(themeUrl, deleteOptions)
          .then(function (response) {
              if (!response.ok) {
                  throw new Error("Failed to delete theme data: " + response.statusText);
              }
              return response.json();
          })
          .then(function (responseData) {
              log("Theme data deleted successfully: " + JSON.stringify(responseData));
              resp.success("PXC Theme Component Uninstalled Successfully!");
          })
          .catch(function (error) {
              log("Error deleting theme data: " + JSON.stringify(error));
              resp.error("Failed to uninstall PXC Theme Component: " + JSON.stringify(error));
          });
         }
        }