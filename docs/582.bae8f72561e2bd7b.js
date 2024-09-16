"use strict";(self.webpackChunksakai_ng=self.webpackChunksakai_ng||[]).push([[582],{2582:(D,l,e)=>{e.r(l),e.d(l,{DashboardModule:()=>C});var c=e(6814),p=e(6223),m=e(9252),v=e(1122),y=e(9552),h=e(707),Z=e(1913),f=e(74),d=e(258),x=e(3620),b=e(6997),t=e(8109),A=e(981),U=e(3859),g=e(3999),u=e(8032);const a=()=>({width:"2.5rem",height:"2.5rem"});let T=(()=>{class o{constructor(n,i,s){this.productService=n,this.layoutService=i,this.translate=s,this.subscription=this.layoutService.configUpdate$.pipe((0,x.b)(25)).subscribe(r=>{this.initChart()})}ngOnInit(){this.initChart(),this.productService.getProductsSmall().then(n=>this.products=n),this.items=[{label:"Add New",icon:"pi pi-fw pi-plus"},{label:"Remove",icon:"pi pi-fw pi-minus"}],b.O.getMainLangChanges().subscribe(n=>{console.log("Main language changed to:",n)})}initChart(){const n=getComputedStyle(document.documentElement),i=n.getPropertyValue("--text-color"),s=n.getPropertyValue("--text-color-secondary"),r=n.getPropertyValue("--surface-border");this.chartData={labels:["January","February","March","April","May","June","July"],datasets:[{label:"First Dataset",data:[65,59,80,81,56,55,40],fill:!1,backgroundColor:n.getPropertyValue("--bluegray-700"),borderColor:n.getPropertyValue("--bluegray-700"),tension:.4},{label:"Second Dataset",data:[28,48,40,19,86,27,90],fill:!1,backgroundColor:n.getPropertyValue("--green-600"),borderColor:n.getPropertyValue("--green-600"),tension:.4}]},this.chartOptions={plugins:{legend:{labels:{color:i}}},scales:{x:{ticks:{color:s},grid:{color:r,drawBorder:!1}},y:{ticks:{color:s},grid:{color:r,drawBorder:!1}}}}}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}static#t=this.\u0275fac=function(i){return new(i||o)(t.Y36(A.M),t.Y36(U.P),t.Y36(g.sK))};static#e=this.\u0275cmp=t.Xpm({type:o,selectors:[["ng-component"]],decls:59,vars:8,consts:[[1,"grid"],[1,"col-12","lg:col-6","xl:col-3"],[1,"card","mb-0"],[1,"flex","justify-content-between","mb-3"],[1,"block","text-500","font-medium","mb-3"],[1,"text-900","font-medium","text-xl"],[1,"flex","align-items-center","justify-content-center","bg-blue-100","border-round",3,"ngStyle"],[1,"pi","pi-shopping-cart","text-blue-500","text-xl"],[1,"text-green-500","font-medium"],[1,"text-500"],[1,"flex","align-items-center","justify-content-center","bg-orange-100","border-round",3,"ngStyle"],[1,"pi","pi-map-marker","text-orange-500","text-xl"],[1,"flex","align-items-center","justify-content-center","bg-cyan-100","border-round",3,"ngStyle"],[1,"pi","pi-inbox","text-cyan-500","text-xl"],[1,"flex","align-items-center","justify-content-center","bg-purple-100","border-round",3,"ngStyle"],[1,"pi","pi-comment","text-purple-500","text-xl"],[1,"col-12"]],template:function(i,s){1&i&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div")(5,"span",4),t._uU(6,"Employees"),t.qZA(),t.TgZ(7,"div",5),t._uU(8,"152"),t.qZA()(),t.TgZ(9,"div",6),t._UZ(10,"i",7),t.qZA()(),t.TgZ(11,"span",8),t._uU(12,"24 new "),t.qZA(),t.TgZ(13,"span",9),t._uU(14,"since last visit"),t.qZA()()(),t.TgZ(15,"div",1)(16,"div",2)(17,"div",3)(18,"div")(19,"span",4),t._uU(20,"Salary"),t.qZA(),t.TgZ(21,"div",5),t._uU(22,"$2.100"),t.qZA()(),t.TgZ(23,"div",10),t._UZ(24,"i",11),t.qZA()(),t.TgZ(25,"span",8),t._uU(26,"%52+ "),t.qZA(),t.TgZ(27,"span",9),t._uU(28,"since last week"),t.qZA()()(),t.TgZ(29,"div",1)(30,"div",2)(31,"div",3)(32,"div")(33,"span",4),t._uU(34,"Users"),t.qZA(),t.TgZ(35,"div",5),t._uU(36,"28441"),t.qZA()(),t.TgZ(37,"div",12),t._UZ(38,"i",13),t.qZA()(),t.TgZ(39,"span",8),t._uU(40,"520 "),t.qZA(),t.TgZ(41,"span",9),t._uU(42,"newly registered"),t.qZA()()(),t.TgZ(43,"div",1)(44,"div",2)(45,"div",3)(46,"div")(47,"span",4),t._uU(48,"Notifications"),t.qZA(),t.TgZ(49,"div",5),t._uU(50,"152 Unread"),t.qZA()(),t.TgZ(51,"div",14),t._UZ(52,"i",15),t.qZA()(),t.TgZ(53,"span",8),t._uU(54,"85 "),t.qZA(),t.TgZ(55,"span",9),t._uU(56,"responded"),t.qZA()()(),t.TgZ(57,"div",16),t._UZ(58,"app-employee"),t.qZA()()),2&i&&(t.xp6(9),t.Q6J("ngStyle",t.DdM(4,a)),t.xp6(14),t.Q6J("ngStyle",t.DdM(5,a)),t.xp6(14),t.Q6J("ngStyle",t.DdM(6,a)),t.xp6(14),t.Q6J("ngStyle",t.DdM(7,a)))},dependencies:[c.PC,u.o],encapsulation:2})}return o})(),S=(()=>{class o{static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275mod=t.oAB({type:o});static#n=this.\u0275inj=t.cJS({imports:[d.Bz.forChild([{path:"",component:T}]),d.Bz]})}return o})(),C=(()=>{class o{static#t=this.\u0275fac=function(i){return new(i||o)};static#e=this.\u0275mod=t.oAB({type:o});static#n=this.\u0275inj=t.cJS({imports:[c.ez,p.u5,m.S,v.$9,y.U$,Z.l,f.ml,h.hJ,S,u.o,g.aw]})}return o})()}}]);