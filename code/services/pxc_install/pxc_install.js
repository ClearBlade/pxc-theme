/**
 * @typedef {{prefix: string, entity_id: string, component_id: string, mfe_settings: Record<string, unknown>}} InstallParams
 * @param {CbServer.BasicReq & {params: InstallParams}} req
 * @param {CbServer.Resp} resp
 */

function pxc_install(req, resp) {
  var params = req.params;
  var entity_id = params.entity_id;
  var component_id = params.component_id;
  var mfe_settings = params.mfe_settings;

  var settingsCollection = ClearBlade.Collection({ collectionName: "custom_settings" });

  var query = ClearBlade.Query();
  query.equalTo("id", "brand");

  settingsCollection.fetch(query, function (err, data) {
      if (err || !data.DATA.length) {
          resp.error("Error fetching PXC logo from custom_settings: " + JSON.stringify(err));
          return;
      }

      var configData = JSON.parse(data.DATA[0].config);
      var pxcLogoUrl = configData[0].logo.logoUrl;

      log(`Fetched PXC logo URL: ${pxcLogoUrl}`);

      var themeCollection = ClearBlade.Collection({ collectionName: "PXCThemeSettings" });
      var themeData = {
          entity_id: entity_id,
          component_id: component_id,
          settings: JSON.stringify(mfe_settings),
          logo_url: pxcLogoUrl 
      };

      themeCollection.create(themeData, function (err, data) {
          if (err) {
              resp.error("Failed to save theme settings: " + JSON.stringify(err));
          } else {
              resp.success("PXC Theme Component Installed Successfully with Logo from custom_settings!");
          }
      });
  });
}