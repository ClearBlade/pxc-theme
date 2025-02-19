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

  var brandingData = {
      id: "brand",
      config: JSON.stringify([{
          logo: {
              logoUrl: "https://cdn.freebiesupply.com/logos/large/2x/phoenix-contact-1-logo-png-transparent.png"
          },
          title: {
              titleText: "Phoenix Contact"
          }
      }]),
      description: "Branding Configuration for Phoenix Contact"
  };

  var settingsCollection = ClearBlade.Collection({ collectionName: "custom_settings" });
  log("Creating new brand row");
  settingsCollection.create(brandingData, function (err, data) {
      if (err) {
          log("Create error: " + JSON.stringify(err));
          resp.error("Failed to create branding in custom_settings: " + JSON.stringify(err));
      } else {
          log("Brand row created successfully: " + JSON.stringify(data));

          var configData = JSON.parse(brandingData.config);
          var pxcLogoUrl = configData[0].logo.logoUrl;

          var themeCollection = ClearBlade.Collection({ collectionName: "custom_settings" });
          var themeData = {
              entity_id: entity_id,
              component_id: component_id,
              settings: JSON.stringify(mfe_settings),
              logo_url: pxcLogoUrl
          };

          themeCollection.create(themeData, function (err, data) {
              if (err) {
                  log("Theme creation error: " + JSON.stringify(err));
                  resp.error("Failed to save theme settings: " + JSON.stringify(err));
              } else {
                  log("Theme created successfully: " + JSON.stringify(data));
                  resp.success("PXC Theme Component Installed Successfully with Logo from custom_settings!");
              }
          });
      }
  });
}