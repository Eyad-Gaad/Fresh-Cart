import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path:'product-Details/:id',renderMode:RenderMode.Server},
  {path:'order/:cId',renderMode:RenderMode.Server},
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
