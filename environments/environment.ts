// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "../libs/environment/src";

export const environment: Environment = {
  production: false,
  apiURL: 'http://localhost:8001',
  apiURL_Ecomm: 'http://localhost:8084',
  apiURLEntertain:'http://localhost:8081',
  apiURLhealth: 'http://localhost:8085',
  cloudFrontURL: 'https://d1ppcfmkludwal.cloudfront.net/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error'; Included with Angular CLI.
