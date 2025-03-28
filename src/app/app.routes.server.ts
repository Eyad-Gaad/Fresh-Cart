import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path:'product-Details/:pId',renderMode:RenderMode.Server},
  {path:'order/:cId',renderMode:RenderMode.Server},
  {path:'brand/:brandName/:bId',renderMode:RenderMode.Server},
  {path:'category/:categoryName/:cId',renderMode:RenderMode.Server},
  {path: '**',renderMode: RenderMode.Prerender}
];