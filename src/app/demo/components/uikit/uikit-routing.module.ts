import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'button',
                data: { breadcrumb: 'Button' },
                loadChildren: () =>
                    import('./button/buttondemo.module').then(
                        (m) => m.ButtonDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'charts',
                data: { breadcrumb: 'Charts' },
                loadChildren: () =>
                    import('./charts/chartsdemo.module').then(
                        (m) => m.ChartsDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'file',
                data: { breadcrumb: 'File' },
                loadChildren: () =>
                    import('./file/filedemo.module').then(
                        (m) => m.FileDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'floatlabel',
                data: { breadcrumb: 'Float Label' },
                loadChildren: () =>
                    import('./floatlabel/floatlabeldemo.module').then(
                        (m) => m.FloatlabelDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'formlayout',
                data: { breadcrumb: 'Form Layout' },
                loadChildren: () =>
                    import('./formlayout/formlayoutdemo.module').then(
                        (m) => m.FormLayoutDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'input',
                data: { breadcrumb: 'Input' },
                loadChildren: () =>
                    import('./input/inputdemo.module').then(
                        (m) => m.InputDemoModule
                    ),
            },
            {
                path: 'invalidstate',
                data: { breadcrumb: 'Invalid State' },
                loadChildren: () =>
                    import('./invalid/invalidstatedemo.module').then(
                        (m) => m.InvalidStateDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'list',
                data: { breadcrumb: 'List' },
                loadChildren: () =>
                    import('./list/listdemo.module').then(
                        (m) => m.ListDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'media',
                data: { breadcrumb: 'Media' },
                loadChildren: () =>
                    import('./media/mediademo.module').then(
                        (m) => m.MediaDemoModule
                    ),
            },
            {
                path: 'message',
                data: { breadcrumb: 'Message' },
                loadChildren: () =>
                    import('./messages/messagesdemo.module').then(
                        (m) => m.MessagesDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'misc',
                data: { breadcrumb: 'Misc' },
                loadChildren: () =>
                    import('./misc/miscdemo.module').then(
                        (m) => m.MiscDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'overlay',
                data: { breadcrumb: 'Overlay' },
                loadChildren: () =>
                    import('./overlays/overlaysdemo.module').then(
                        (m) => m.OverlaysDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'panel',
                data: { breadcrumb: 'Panel' },
                loadChildren: () =>
                    import('./panels/panelsdemo.module').then(
                        (m) => m.PanelsDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/tabledemo.module').then(
                        (m) => m.TableDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'tree',
                data: { breadcrumb: 'Tree' },
                loadChildren: () =>
                    import('./tree/treedemo.module').then(
                        (m) => m.TreeDemoModule
                    ),
                canActivate: [authGuard],
            },
            {
                path: 'menu',
                data: { breadcrumb: 'Menu' },
                loadChildren: () =>
                    import('./menus/menus.module').then((m) => m.MenusModule),
                canActivate: [authGuard],
            },

            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class UIkitRoutingModule {}
