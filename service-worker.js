if(!self.define){let e,i={};const d=(d,s)=>(d=new URL(d+".js",s).href,i[d]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=i,document.head.appendChild(e)}else e=d,importScripts(d),i()})).then((()=>{let e=i[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(s,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let a={};const c=e=>d(e,r),o={module:{uri:r},exports:a,require:c};i[r]=Promise.all(s.map((e=>o[e]||c(e)))).then((e=>(t(...e),a)))}}define(["./workbox-f0806d7b"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"../dist/app/app.d.ts",revision:"79ade8ce2fed58403edc62a41ae04a4c"},{url:"../dist/app/index.d.ts",revision:"0901991449629c252263f2d76875b8d4"},{url:"../dist/index.d.ts",revision:"0884b76b9b8bd3d2776e1840cd54d79b"},{url:"../dist/pages/articles/basic-perspective/basic-perspective.d.ts",revision:"cbe0be9575a9717b0806d55c96e2a71e"},{url:"../dist/pages/articles/basic-perspective/index.d.ts",revision:"a8df5f3b2b117a83e65917fa423e5a9f"},{url:"../dist/pages/articles/basic-perspective/painter.d.ts",revision:"0221712fb131d2a003ca804dd2224ad2"},{url:"../dist/pages/articles/welcome/index.d.ts",revision:"8e5e42a8433c1cc61633b41985964084"},{url:"../dist/pages/articles/welcome/welcome.d.ts",revision:"781cb532a7d263d24821797c156fe4b9"},{url:"../dist/pages/tools/painter/code-generator/code-generator-view.d.ts",revision:"09841190a39ba08098c180b57c0c196b"},{url:"../dist/pages/tools/painter/code-generator/code/attribute.d.ts",revision:"0c11c3bac7593419ec6430547156734f"},{url:"../dist/pages/tools/painter/code-generator/code/buffer.d.ts",revision:"a5dc4b378c5d94e27dfc88ea5ea52326"},{url:"../dist/pages/tools/painter/code-generator/code/class.d.ts",revision:"82edbe99fd630862d23edd6e39c43bbc"},{url:"../dist/pages/tools/painter/code-generator/code/comment.d.ts",revision:"a930fa0d443de3bc9890c238d2e2ef43"},{url:"../dist/pages/tools/painter/code-generator/code/common.d.ts",revision:"18d3186908dec748c69df4bd9bbdbd20"},{url:"../dist/pages/tools/painter/code-generator/code/constructor.d.ts",revision:"a27a9fae1498c90a0a2b0755783993df"},{url:"../dist/pages/tools/painter/code-generator/code/create.d.ts",revision:"6d6028af00ceb629cad0d8a1107b07f7"},{url:"../dist/pages/tools/painter/code-generator/code/data.d.ts",revision:"4badfa3f1534fd370a02c5e6eeabff4f"},{url:"../dist/pages/tools/painter/code-generator/code/destroy.d.ts",revision:"78451e2bbf8e808fe8675a582858d819"},{url:"../dist/pages/tools/painter/code-generator/code/paint.d.ts",revision:"ff5418b8919350d0de174e83504cc440"},{url:"../dist/pages/tools/painter/code-generator/code/uniform.d.ts",revision:"3ca61a88cc08518755dc7a6b10b1fea7"},{url:"../dist/pages/tools/painter/code-generator/index.d.ts",revision:"c56b9da9312f739f92f32a14af0c0a7a"},{url:"../dist/pages/tools/painter/code-generator/types.d.ts",revision:"d0fce71fa56b21ffb7248a2f4d7b80a8"},{url:"../dist/pages/tools/painter/code-options/code-options-view.d.ts",revision:"73aa41433ae6856729ce295e057cbd50"},{url:"../dist/pages/tools/painter/code-options/index.d.ts",revision:"a631419defa0cb291b9a7e3b7ae06a0f"},{url:"../dist/pages/tools/painter/index.d.ts",revision:"7fb680567051042b35d40939db2a9abb"},{url:"../dist/pages/tools/painter/painter-tools.d.ts",revision:"a4cd67e2e4522f2b481bc07c8f6acc65"},{url:"../dist/pages/tools/painter/program-code-editor/index.d.ts",revision:"fa41f0d759b31cb1fec18dc4e958f43f"},{url:"../dist/pages/tools/painter/program-code-editor/program-code-editor-view.d.ts",revision:"c8c5a633767d7548bb36cc8b6d64f4eb"},{url:"../dist/setupTests.d.ts",revision:"31b75fb95080331e67472a1b6eaf9f88"},{url:"../dist/test/index.d.ts",revision:"aea6c131ae2cb3224543bf01d5f6fba5"},{url:"../dist/test/painter.d.ts",revision:"0221712fb131d2a003ca804dd2224ad2"},{url:"../dist/test/test.d.ts",revision:"c29b096707afb9aeaaf114384b5fa56a"},{url:"../dist/tools/async/debouncer.d.ts",revision:"0d694b05935cbc0762824aadedeae4e2"},{url:"../dist/tools/async/index.d.ts",revision:"be3d750fdd6d79b9e1ae7a273972eb57"},{url:"../dist/tools/async/sleep.d.ts",revision:"a6237bcd32de35167d53999ddb4970f6"},{url:"../dist/tools/async/throttler.d.ts",revision:"d397e0a8400875bb51313a8dcd6c77af"},{url:"../dist/tools/async/update-tasks.d.ts",revision:"8c8145c7c329ed291d6a8c26f86f22a9"},{url:"../dist/tools/base64.d.ts",revision:"b1524f44a400222de5da2cd1ad36f908"},{url:"../dist/tools/copy-to-clipboard.d.ts",revision:"ef1f5481d4a65d190f8a27f8da6fb2a8"},{url:"../dist/tools/exception.d.ts",revision:"1fa0be2028c14e7dc642fdd6f9a106b2"},{url:"../dist/tools/generic-event.d.ts",revision:"292fee9582c236ea3e819030c3b2215c"},{url:"../dist/tools/grammar/grammar.d.ts",revision:"468a0bc8f40d4beb1de63b3d05d9ef87"},{url:"../dist/tools/grammar/index.d.ts",revision:"d852fb3224f63849de29feeb07cf0930"},{url:"../dist/tools/persistence/index.d.ts",revision:"15c76631d9f0aebb4b12709a4369fdbe"},{url:"../dist/tools/persistence/persistence.d.ts",revision:"9c16e4fd6ca527f1c45692b3453be2ed"},{url:"../dist/tools/type-guards.d.ts",revision:"5091bdcfedf156193b5e60b8351f87c5"},{url:"../dist/ui/color/color.d.ts",revision:"27e8fb03350ca4a43ff0e95609c054aa"},{url:"../dist/ui/color/index.d.ts",revision:"d4090ab722b9adacd908cd6a1a1d83f3"},{url:"../dist/ui/factory/icon/icon-factory.d.ts",revision:"1b58579a215c7988514f7384ebb7812c"},{url:"../dist/ui/factory/icon/index.d.ts",revision:"853305f182e51041c1c7ecdc3766ca2a"},{url:"../dist/ui/hooks/debounced-effect.d.ts",revision:"0015ce933ac9d571f29472ad4736bebc"},{url:"../dist/ui/hooks/global.d.ts",revision:"7e54391c448329887cf4026d903bf1f3"},{url:"../dist/ui/hooks/hash.d.ts",revision:"0b68ab28a8bcc3acc05dcb162a8ab4bf"},{url:"../dist/ui/hooks/index.d.ts",revision:"c1ccdb8a4fe045031b1a86c10e5ba06c"},{url:"../dist/ui/hooks/local-storage-state.d.ts",revision:"503cddafb5f46e4b90fa7bee8b6ef71d"},{url:"../dist/ui/hooks/resize-observer.d.ts",revision:"3894f644babc9c0855950d5fd96d554d"},{url:"../dist/ui/hooks/toggle-popup.d.ts",revision:"23b21cc6d0ec2a7c8091168f36fd6b15"},{url:"../dist/ui/input/index.d.ts",revision:"ff459a50c5428a933bda15ced37ee519"},{url:"../dist/ui/input/input.d.ts",revision:"d94569c590198008ada38b4ceb1a9c35"},{url:"../dist/ui/modal/abstract-modal.d.ts",revision:"0bb11da2700ed3f95172706720d7c692"},{url:"../dist/ui/modal/hash.d.ts",revision:"7310e428e0e8c895a33f851ce72f8338"},{url:"../dist/ui/modal/index.d.ts",revision:"90d67dc493b3ec5c24dad2e971309d19"},{url:"../dist/ui/modal/modal-stack.d.ts",revision:"a9c6e27a30a472ab0a223e955d5009de"},{url:"../dist/ui/modal/modal.d.ts",revision:"6c8eb2a7d3a5c439e890f05e15a47b69"},{url:"../dist/ui/theme/css-var-manager.d.ts",revision:"3665cdc624369ac48c7de75e7590cf05"},{url:"../dist/ui/theme/index.d.ts",revision:"aaec56cc007ce1d7974c89039815e445"},{url:"../dist/ui/theme/theme.d.ts",revision:"98a9622575e0bd3f65b04a55deb7da09"},{url:"../dist/ui/view/button/button-view.d.ts",revision:"7839f8bf2a75c2aac3853c0e7cbbb2a8"},{url:"../dist/ui/view/button/index.d.ts",revision:"0b888e303460fdaed2a053c0dd6bebe9"},{url:"../dist/ui/view/checkbox/checkbox-view.d.ts",revision:"11e3c65fe6cb6c2f55ed9f416e6d4132"},{url:"../dist/ui/view/checkbox/index.d.ts",revision:"8d37dbb680486da6a7665d89cc89ac0d"},{url:"../dist/ui/view/chip/chip-view.d.ts",revision:"dd619ef730e91f67b0497b522d91ce99"},{url:"../dist/ui/view/chip/index.d.ts",revision:"6b2098048a962991597927249d2c9394"},{url:"../dist/ui/view/color-picker/color-picker.d.ts",revision:"2521e9976e2f0bea0eba7480328a3029"},{url:"../dist/ui/view/color-picker/gesture/basic-handler.d.ts",revision:"70eee981fa0e4acc011646b5b5da6dfd"},{url:"../dist/ui/view/color-picker/gesture/basic-handler.types.d.ts",revision:"910c27c20a748ce1f86d6c379c6253f4"},{url:"../dist/ui/view/color-picker/gesture/finger.d.ts",revision:"eb744236aac3d23f0765a5e21bdd90ae"},{url:"../dist/ui/view/color-picker/gesture/gesture.d.ts",revision:"09cf5a422ec8743dd29e230668e72b6f"},{url:"../dist/ui/view/color-picker/gesture/index.d.ts",revision:"9bc99ff14ad8b4a7c6b71563da1c0394"},{url:"../dist/ui/view/color-picker/gesture/moves.d.ts",revision:"b9dad3d1cd825a987ff4bb9af30de81c"},{url:"../dist/ui/view/color-picker/gesture/types.d.ts",revision:"d091d3a04fb996296eac986310e29d1a"},{url:"../dist/ui/view/color-picker/index.d.ts",revision:"d852496d8ccfdfa6ccfcbd12e273d22c"},{url:"../dist/ui/view/combo-lang/combo-lang.d.ts",revision:"2e7165b2c6d85a8ff4b7f7a5db63599d"},{url:"../dist/ui/view/combo-lang/index.d.ts",revision:"8bd1e436dbce5eafbe240fd3249c2df3"},{url:"../dist/ui/view/combo/combo-item/combo-item-view.d.ts",revision:"36d0538e120d1d319deec8321c5d84e0"},{url:"../dist/ui/view/combo/combo-item/index.d.ts",revision:"364f1d2f53a9e731fa0831c534df9c36"},{url:"../dist/ui/view/combo/combo-view.d.ts",revision:"5b36b5eced1c557c6acc0e9d3bbb0176"},{url:"../dist/ui/view/combo/hooks.d.ts",revision:"175560631bea989b305ff32f06b3031a"},{url:"../dist/ui/view/combo/index.d.ts",revision:"52cad3ac9dbd55a695058234d88add1a"},{url:"../dist/ui/view/dialog/dialog-view.d.ts",revision:"ba16c492206d9fc9c2e445c7dabc1c32"},{url:"../dist/ui/view/dialog/index.d.ts",revision:"171eec9cf8045b126ab346947cf646ec"},{url:"../dist/ui/view/drag-and-drop/drag-and-drop-view.d.ts",revision:"c66b3d5b343cb0e137e64153259510de"},{url:"../dist/ui/view/drag-and-drop/index.d.ts",revision:"91e59d048bce51b8b6962c9f41e0cd77"},{url:"../dist/ui/view/expand/expand.d.ts",revision:"0a9d607377b087e104b134cf98647bf9"},{url:"../dist/ui/view/expand/index.d.ts",revision:"a735ffd5b863df1fe03195fafb1bb26f"},{url:"../dist/ui/view/file-size/file-size-view.d.ts",revision:"67bd511814492aedddec3895d44a7ecb"},{url:"../dist/ui/view/file-size/index.d.ts",revision:"bd5036fa80a6989e23df3ed680968f81"},{url:"../dist/ui/view/flex/flex-view.d.ts",revision:"315baa50fde660b56d9e31f239f5e0de"},{url:"../dist/ui/view/flex/index.d.ts",revision:"175cd6467a4b0be936488c7b87df2364"},{url:"../dist/ui/view/floating-button/floating-button-view.d.ts",revision:"3e1fed7efbbe6d3346a59a7647da5596"},{url:"../dist/ui/view/floating-button/index.d.ts",revision:"94a69cc44b983dbe8499092657036f7d"},{url:"../dist/ui/view/icon/icon-view.d.ts",revision:"d50ed38f2b50d051301bc3a474f76d2a"},{url:"../dist/ui/view/icon/index.d.ts",revision:"45a37d54c318b8066db9135ccaed62d7"},{url:"../dist/ui/view/image/image-view.d.ts",revision:"4530bd1d3cc3d9cfdbea2e33af69517d"},{url:"../dist/ui/view/image/index.d.ts",revision:"676937c0a4f3b6e0f5905331e3be4065"},{url:"../dist/ui/view/input/color/color-view.d.ts",revision:"355d03861c1b4044023e4a7eebfbe0ac"},{url:"../dist/ui/view/input/color/index.d.ts",revision:"6ec1685eb207713b0ce5a830fca250df"},{url:"../dist/ui/view/input/file/index.d.ts",revision:"ce6ff204078c9e2337a29514836a5ce3"},{url:"../dist/ui/view/input/file/input-file.d.ts",revision:"85f171df2a379cf48e708a79862092ac"},{url:"../dist/ui/view/input/float/float-view.d.ts",revision:"d9e96052f8445e17804ccf44b96aa3b2"},{url:"../dist/ui/view/input/float/index.d.ts",revision:"08f40c8e6c055970cec508deb34ac06d"},{url:"../dist/ui/view/input/image/index.d.ts",revision:"3dd45efd4e4b975e62084bb0b0c58d65"},{url:"../dist/ui/view/input/image/input-image.d.ts",revision:"12305d20f963500b5040763cafdd275f"},{url:"../dist/ui/view/input/image/preview/index.d.ts",revision:"c92722c71e14e09eb41aaca66ab4aa64"},{url:"../dist/ui/view/input/image/preview/preview-input-image.d.ts",revision:"e4fc942c076aaeddfab7cb30eba6267f"},{url:"../dist/ui/view/input/integer/index.d.ts",revision:"bc65eb092840a4ee17d348e0d21fc6bf"},{url:"../dist/ui/view/input/integer/integer-view.d.ts",revision:"da3d366f112cffd7b20c8a28d2cea322"},{url:"../dist/ui/view/input/text/index.d.ts",revision:"a0757ce3959c40fdea80625323e2e96d"},{url:"../dist/ui/view/input/text/text-view.d.ts",revision:"5a3fcfd9391e584966991310a5248a48"},{url:"../dist/ui/view/input/time/index.d.ts",revision:"5f3f1eb2a84826c3191b405697d2d02c"},{url:"../dist/ui/view/input/time/time-view.d.ts",revision:"5b9ae665d6ed4ab2411cbf2dab0a6692"},{url:"../dist/ui/view/label/index.d.ts",revision:"37a6cd30c746bacafdb5812419388c3b"},{url:"../dist/ui/view/label/label-view.d.ts",revision:"ef3d03cee6418b47b14495807bc67235"},{url:"../dist/ui/view/options/index.d.ts",revision:"5fd951c6e0dfa593bd2842afd7a9f537"},{url:"../dist/ui/view/options/options-view.d.ts",revision:"3be1301fd9e1b6f0d3f63f269b7e1780"},{url:"../dist/ui/view/progress/index.d.ts",revision:"3e6c7da0cfc0191deb1d14a98a7e21f0"},{url:"../dist/ui/view/progress/progress.d.ts",revision:"52ad01bd7c2118e77126ca24f227a064"},{url:"../dist/ui/view/runnable/index.d.ts",revision:"72c271142a08725126188819b6c0fd80"},{url:"../dist/ui/view/runnable/runnable-view.d.ts",revision:"fe198f819ef7ee3abd477c3f2f00f0d5"},{url:"../dist/ui/view/simple-combo/index.d.ts",revision:"0c8362ec91e2ed51a374e3efb2fc2b18"},{url:"../dist/ui/view/simple-combo/simple-combo-view.d.ts",revision:"6099b8d9cb77b70ec313d82d52e1091a"},{url:"../dist/ui/view/spinner/index.d.ts",revision:"951c3f467f8db23f7c9566becafb8c97"},{url:"../dist/ui/view/spinner/spinner-view.d.ts",revision:"317c36d39505a27cbbb8761f4c79631f"},{url:"../dist/ui/view/stack/index.d.ts",revision:"b091e91e1cc0ceab69edf0d991afe3a8"},{url:"../dist/ui/view/stack/stack-view.d.ts",revision:"dc44834e00b776243e3b8e5c2d95fc58"},{url:"../dist/ui/view/surface/index.d.ts",revision:"663671a35484a373b076b8316c692f3f"},{url:"../dist/ui/view/surface/surface-view.d.ts",revision:"ab1b2e9de3dae21348935ee4cce4db67"},{url:"../dist/ui/view/tabstrip/index.d.ts",revision:"89bff91df7ddcd7b7ead75b671b123aa"},{url:"../dist/ui/view/tabstrip/tabstrip-view.d.ts",revision:"17ad605b89702c6427c7c50bf82d72eb"},{url:"../dist/ui/view/touchable/index.d.ts",revision:"7e107cc8d700984ecf615cfda6672e94"},{url:"../dist/ui/view/touchable/touchable-view.d.ts",revision:"2a4410e0ee492f9b63a791a3cc39ce18"},{url:"../dist/ui/view/types.d.ts",revision:"b40021bdc1d601e69a37b0b7d3fbb2a4"},{url:"../dist/ui/view/wizard/index.d.ts",revision:"ffaecd353c2c7d80491eed27a9b14072"},{url:"../dist/ui/view/wizard/wizard-view.d.ts",revision:"0452b3cb9867079bc45c21903359ef17"},{url:"../dist/view/code-editor/code-editor-view.d.ts",revision:"425c0c78b087d590b386a61c5371c882"},{url:"../dist/view/code-editor/index.d.ts",revision:"95537bd2f740a42024d2d6e332bd1bd6"},{url:"../dist/view/code/code-view.d.ts",revision:"adec0f597f3bb91c87a2ee109f262401"},{url:"../dist/view/code/index.d.ts",revision:"a1609772a89bf802a7e85b7fd50b57ca"},{url:"../dist/view/fallback/fallback-view.d.ts",revision:"db3d1258d5b891202cfac3be638c48a4"},{url:"../dist/view/fallback/index.d.ts",revision:"12252efd06a12209d51581c3f355d412"},{url:"../dist/view/markdown/index.d.ts",revision:"a64e9b9dc1a90dcbf84e5f0e21be3760"},{url:"../dist/view/markdown/markdown-view.d.ts",revision:"c128e1e34dfed53cc74e4fd778f73ed8"},{url:"../dist/view/scene/index.d.ts",revision:"e38fa48a62d1d6db62970eae52f5584d"},{url:"../dist/view/scene/scene-view.d.ts",revision:"8055cdc5a6b92f1b03134e8fcd9c9f06"},{url:"../dist/view/shader-code-editor/index.d.ts",revision:"81e5e39648d63ce0899f6b3209ca3e06"},{url:"../dist/view/shader-code-editor/shader-code-editor-view.d.ts",revision:"173d75f139086d0e9134cd6da3a55a75"},{url:"../dist/webgl2/analyse-program/analyse-program.d.ts",revision:"4d3fbe4a85bb5f633b2dabb8375c69b4"},{url:"../dist/webgl2/analyse-program/attributes.d.ts",revision:"e15daf2eaa0f4a5db402f293c97e46f4"},{url:"../dist/webgl2/analyse-program/index.d.ts",revision:"050650374cc3ab3fb8a09682d9b348ed"},{url:"../dist/webgl2/analyse-program/uniforms.d.ts",revision:"af3104e8bc64d8dc807e408b1b390a5a"},{url:"../dist/webgl2/lookup-const-name.d.ts",revision:"629194ec0fcb45d1054aa99a3564483a"},{url:"./scr/app.bf9a4ccab92772214ed7.js",revision:null},{url:"./scr/libs.f7d04e70e8bd16833b91.js",revision:null},{url:"./scr/libs.f7d04e70e8bd16833b91.js.LICENSE.txt",revision:"a29056128c10fb628e7d7e7a78e7f860"},{url:"./scr/runtime.0c4dfca5b9829efcd4e4.js",revision:null},{url:"favicon.ico",revision:"7a92d6a67d81716d2343b349053617f4"},{url:"index.html",revision:"b9bc3198c06c8f845978e619ebd25cc3"},{url:"logo192.png",revision:"33dbdd0177549353eeeb785d02c294af"},{url:"logo512.png",revision:"917515db74ea8d1aee6a246cfbcc0b45"},{url:"manifest.json",revision:"d9d975cebe2ec20b6c652e1e4c12ccf0"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"}],{})}));
//# sourceMappingURL=service-worker.js.map
