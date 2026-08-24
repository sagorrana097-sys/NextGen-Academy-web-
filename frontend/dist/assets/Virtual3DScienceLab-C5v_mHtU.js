import{j as e}from"./index-DsepcBAj.js";import{r as d,D as fe,bs as X,y as Z,E as xe,e as pe,bZ as he,bm as me,ab as ve,bu as ge}from"./vendor-icons-hd3nCPF2.js";import{R as be,I as ye,F as J,a as F,b as z,W as Se,B as $,S as oe,V as M,c as we,U as K,d as Q,e as ae,M as je,f as O,L as _e,g as Ee,h as Me,u as Ne,C as Le,_ as k,i as T,j as Ae,k as Ce,O as ze,l as w,m as B,T as ee}from"./shapes-BjlIfNlj.js";import"./vendor-katex-CmbQUdAl.js";const le=parseInt(be.replace(/\D+/g,"")),ce=le>=125?"uv1":"uv2",te=new $,U=new M;class Y extends ye{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],s=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new J(t,3)),this.setAttribute("uv",new J(s,2))}applyMatrix4(t){const s=this.attributes.instanceStart,i=this.attributes.instanceEnd;return s!==void 0&&(s.applyMatrix4(t),i.applyMatrix4(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let s;t instanceof Float32Array?s=t:Array.isArray(t)&&(s=new Float32Array(t));const i=new F(s,6,1);return this.setAttribute("instanceStart",new z(i,3,0)),this.setAttribute("instanceEnd",new z(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,s=3){let i;t instanceof Float32Array?i=t:Array.isArray(t)&&(i=new Float32Array(t));const n=new F(i,s*2,1);return this.setAttribute("instanceColorStart",new z(n,s,0)),this.setAttribute("instanceColorEnd",new z(n,s,s)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Se(t.geometry)),this}fromLineSegments(t){const s=t.geometry;return this.setPositions(s.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $);const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;t!==void 0&&s!==void 0&&(this.boundingBox.setFromBufferAttribute(t),te.setFromBufferAttribute(s),this.boundingBox.union(te))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oe),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;if(t!==void 0&&s!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,o=t.count;r<o;r++)U.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(U)),U.fromBufferAttribute(s,r),n=Math.max(n,i.distanceToSquared(U));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class de extends Y{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const s=t.length-3,i=new Float32Array(2*s);for(let n=0;n<s;n+=3)i[2*n]=t[n],i[2*n+1]=t[n+1],i[2*n+2]=t[n+2],i[2*n+3]=t[n+3],i[2*n+4]=t[n+4],i[2*n+5]=t[n+5];return super.setPositions(i),this}setColors(t,s=3){const i=t.length-s,n=new Float32Array(2*i);if(s===3)for(let r=0;r<i;r+=s)n[2*r]=t[r],n[2*r+1]=t[r+1],n[2*r+2]=t[r+2],n[2*r+3]=t[r+3],n[2*r+4]=t[r+4],n[2*r+5]=t[r+5];else for(let r=0;r<i;r+=s)n[2*r]=t[r],n[2*r+1]=t[r+1],n[2*r+2]=t[r+2],n[2*r+3]=t[r+3],n[2*r+4]=t[r+4],n[2*r+5]=t[r+5],n[2*r+6]=t[r+6],n[2*r+7]=t[r+7];return super.setColors(n,s),this}fromLine(t){const s=t.geometry;return this.setPositions(s.attributes.position.array),this}}class q extends we{constructor(t){super({type:"LineMaterial",uniforms:K.clone(K.merge([Q.common,Q.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ae(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${le>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(s){this.uniforms.diffuse.value=s}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(s){s===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(s){this.uniforms.linewidth.value=s}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(s){!!s!="USE_DASH"in this.defines&&(this.needsUpdate=!0),s===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(s){this.uniforms.dashScale.value=s}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(s){this.uniforms.dashSize.value=s}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(s){this.uniforms.dashOffset.value=s}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(s){this.uniforms.gapSize.value=s}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(s){this.uniforms.opacity.value=s}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(s){this.uniforms.resolution.value.copy(s)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(s){!!s!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),s===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const W=new O,se=new M,ne=new M,m=new O,v=new O,j=new O,G=new M,V=new Ee,g=new _e,ie=new M,I=new $,D=new oe,_=new O;let E,A;function re(a,t,s){return _.set(0,0,-t,1).applyMatrix4(a.projectionMatrix),_.multiplyScalar(1/_.w),_.x=A/s.width,_.y=A/s.height,_.applyMatrix4(a.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}function Oe(a,t){const s=a.matrixWorld,i=a.geometry,n=i.attributes.instanceStart,r=i.attributes.instanceEnd,o=Math.min(i.instanceCount,n.count);for(let l=0,f=o;l<f;l++){g.start.fromBufferAttribute(n,l),g.end.fromBufferAttribute(r,l),g.applyMatrix4(s);const x=new M,u=new M;E.distanceSqToSegment(g.start,g.end,u,x),u.distanceTo(x)<A*.5&&t.push({point:u,pointOnLine:x,distance:E.origin.distanceTo(u),object:a,face:null,faceIndex:l,uv:null,[ce]:null})}}function Be(a,t,s){const i=t.projectionMatrix,r=a.material.resolution,o=a.matrixWorld,l=a.geometry,f=l.attributes.instanceStart,x=l.attributes.instanceEnd,u=Math.min(l.instanceCount,f.count),p=-t.near;E.at(1,j),j.w=1,j.applyMatrix4(t.matrixWorldInverse),j.applyMatrix4(i),j.multiplyScalar(1/j.w),j.x*=r.x/2,j.y*=r.y/2,j.z=0,G.copy(j),V.multiplyMatrices(t.matrixWorldInverse,o);for(let h=0,N=u;h<N;h++){if(m.fromBufferAttribute(f,h),v.fromBufferAttribute(x,h),m.w=1,v.w=1,m.applyMatrix4(V),v.applyMatrix4(V),m.z>p&&v.z>p)continue;if(m.z>p){const c=m.z-v.z,S=(m.z-p)/c;m.lerp(v,S)}else if(v.z>p){const c=v.z-m.z,S=(v.z-p)/c;v.lerp(m,S)}m.applyMatrix4(i),v.applyMatrix4(i),m.multiplyScalar(1/m.w),v.multiplyScalar(1/v.w),m.x*=r.x/2,m.y*=r.y/2,v.x*=r.x/2,v.y*=r.y/2,g.start.copy(m),g.start.z=0,g.end.copy(v),g.end.z=0;const b=g.closestPointToPointParameter(G,!0);g.at(b,ie);const C=Me.lerp(m.z,v.z,b),L=C>=-1&&C<=1,H=G.distanceTo(ie)<A*.5;if(L&&H){g.start.fromBufferAttribute(f,h),g.end.fromBufferAttribute(x,h),g.start.applyMatrix4(o),g.end.applyMatrix4(o);const c=new M,S=new M;E.distanceSqToSegment(g.start,g.end,S,c),s.push({point:S,pointOnLine:c,distance:E.origin.distanceTo(S),object:a,face:null,faceIndex:h,uv:null,[ce]:null})}}}class ue extends je{constructor(t=new Y,s=new q({color:Math.random()*16777215})){super(t,s),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,s=t.attributes.instanceStart,i=t.attributes.instanceEnd,n=new Float32Array(2*s.count);for(let o=0,l=0,f=s.count;o<f;o++,l+=2)se.fromBufferAttribute(s,o),ne.fromBufferAttribute(i,o),n[l]=l===0?0:n[l-1],n[l+1]=n[l]+se.distanceTo(ne);const r=new F(n,2,1);return t.setAttribute("instanceDistanceStart",new z(r,1,0)),t.setAttribute("instanceDistanceEnd",new z(r,1,1)),this}raycast(t,s){const i=this.material.worldUnits,n=t.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;E=t.ray;const o=this.matrixWorld,l=this.geometry,f=this.material;A=f.linewidth+r,l.boundingSphere===null&&l.computeBoundingSphere(),D.copy(l.boundingSphere).applyMatrix4(o);let x;if(i)x=A*.5;else{const p=Math.max(n.near,D.distanceToPoint(E.origin));x=re(n,p,f.resolution)}if(D.radius+=x,E.intersectsSphere(D)===!1)return;l.boundingBox===null&&l.computeBoundingBox(),I.copy(l.boundingBox).applyMatrix4(o);let u;if(i)u=A*.5;else{const p=Math.max(n.near,I.distanceToPoint(E.origin));u=re(n,p,f.resolution)}I.expandByScalar(u),E.intersectsBox(I)!==!1&&(i?Oe(this,s):Be(this,n,s))}onBeforeRender(t){const s=this.material.uniforms;s&&s.resolution&&(t.getViewport(W),this.material.uniforms.resolution.value.set(W.z,W.w))}}class Ue extends ue{constructor(t=new de,s=new q({color:Math.random()*16777215})){super(t,s),this.isLine2=!0,this.type="Line2"}}const P=d.forwardRef(function({points:t,color:s=16777215,vertexColors:i,linewidth:n,lineWidth:r,segments:o,dashed:l,...f},x){var u,p;const h=Ne(L=>L.size),N=d.useMemo(()=>o?new ue:new Ue,[o]),[y]=d.useState(()=>new q),b=(i==null||(u=i[0])==null?void 0:u.length)===4?4:3,C=d.useMemo(()=>{const L=o?new Y:new de,H=t.map(c=>{const S=Array.isArray(c);return c instanceof M||c instanceof O?[c.x,c.y,c.z]:c instanceof ae?[c.x,c.y,0]:S&&c.length===3?[c[0],c[1],c[2]]:S&&c.length===2?[c[0],c[1],0]:c});if(L.setPositions(H.flat()),i){s=16777215;const c=i.map(S=>S instanceof Le?S.toArray():S);L.setColors(c.flat(),b)}return L},[t,o,i,b]);return d.useLayoutEffect(()=>{N.computeLineDistances()},[t,N]),d.useLayoutEffect(()=>{l?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[l,y]),d.useEffect(()=>()=>{C.dispose(),y.dispose()},[C]),d.createElement("primitive",k({object:N,ref:x},f),d.createElement("primitive",{object:C,attach:"geometry"}),d.createElement("primitive",k({object:y,attach:"material",color:s,vertexColors:!!i,resolution:[h.width,h.height],linewidth:(p=n??r)!==null&&p!==void 0?p:1,dashed:l,transparent:b===4},f)))});var Ie=`#define GLSLIFY 1
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;class De extends Ae{constructor(t={}){super(t),this.setValues(t),this._time={value:0},this._distort={value:.4},this._radius={value:1}}onBeforeCompile(t){t.uniforms.time=this._time,t.uniforms.radius=this._radius,t.uniforms.distort=this._distort,t.vertexShader=`
      uniform float time;
      uniform float radius;
      uniform float distort;
      ${Ie}
      ${t.vertexShader}
    `,t.vertexShader=t.vertexShader.replace("#include <begin_vertex>",`
        float updateTime = time / 50.0;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
        vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));
        `)}get time(){return this._time.value}set time(t){this._time.value=t}get distort(){return this._distort.value}set distort(t){this._distort.value=t}get radius(){return this._radius.value}set radius(t){this._radius.value=t}}const Pe=d.forwardRef(({speed:a=1,...t},s)=>{const[i]=d.useState(()=>new De);return T(n=>i&&(i.time=n.clock.getElapsedTime()*a)),d.createElement("primitive",k({object:i,ref:s,attach:"material"},t))}),R={name:"NextGen Academy",instructor:"মো: আলমগীর হোসেন (সাগর)",contact:"০১৭৯২৮১৮০০৫",address:"পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর"};function Re({organelle:a,setOrganelle:t,wireframe:s}){const i=d.useRef(),n=d.useRef(),r=d.useRef();return T((o,l)=>{i.current&&(i.current.rotation.y+=l*.4),n.current&&(n.current.rotation.x+=l*.6),r.current&&(r.current.rotation.y+=l*.1)}),e.jsxs("group",{children:[e.jsx(w,{ref:r,args:[2.8,32,32],onClick:o=>{o.stopPropagation(),t("membrane")},children:e.jsx("meshPhysicalMaterial",{color:"#38bdf8",transmission:.8,opacity:.4,transparent:!0,roughness:.1,ior:1.2,wireframe:s})}),e.jsx(w,{ref:i,args:[1.1,32,32],position:[0,0,0],onClick:o=>{o.stopPropagation(),t("nucleus")},children:e.jsx(Pe,{color:"#f43f5e",speed:2,distort:.3,roughness:.2,wireframe:s})}),e.jsx(w,{args:[.45,16,16],position:[.2,.2,.2],children:e.jsx("meshStandardMaterial",{color:"#fbbf24",emissive:"#d97706",emissiveIntensity:.5})}),e.jsx("group",{position:[1.5,.8,.5],ref:n,onClick:o=>{o.stopPropagation(),t("mitochondria")},children:e.jsx(B,{args:[.25,.25,.8,16],rotation:[.5,.4,.8],children:e.jsx("meshStandardMaterial",{color:"#f97316",roughness:.3,wireframe:s})})}),e.jsx("group",{position:[-1.4,-.7,-.6],onClick:o=>{o.stopPropagation(),t("mitochondria")},children:e.jsx(B,{args:[.25,.25,.7,16],rotation:[-.4,.8,.2],children:e.jsx("meshStandardMaterial",{color:"#ea580c",roughness:.3,wireframe:s})})}),e.jsxs("group",{position:[0,0,0],onClick:o=>{o.stopPropagation(),t("er")},children:[e.jsx(ee,{args:[1.6,.1,16,64],rotation:[1.2,.5,0],children:e.jsx("meshStandardMaterial",{color:"#a855f7",roughness:.4,wireframe:s})}),e.jsx(ee,{args:[1.9,.08,16,64],rotation:[-.8,.7,.3],children:e.jsx("meshStandardMaterial",{color:"#c084fc",roughness:.4,wireframe:s})})]}),[[.8,1.2,-.5],[-.9,1.1,.6],[1.1,-1,.7],[-1.2,-1.1,-.8],[.5,-1.4,-.9],[-.4,1.5,-.7]].map((o,l)=>e.jsx(w,{args:[.08,8,8],position:o,children:e.jsx("meshStandardMaterial",{color:"#22c55e",emissive:"#15803d",emissiveIntensity:.6})},l))]})}function Te({molType:a="H2O",wireframe:t}){const s=d.useRef();return T((i,n)=>{s.current&&(s.current.rotation.y+=n*.4,s.current.rotation.x+=n*.2)}),a==="H2O"?e.jsxs("group",{ref:s,children:[e.jsx(w,{args:[.9,32,32],position:[0,0,0],children:e.jsx("meshStandardMaterial",{color:"#ef4444",roughness:.2,wireframe:t})}),e.jsx(w,{args:[.5,24,24],position:[1.4,1.1,0],children:e.jsx("meshStandardMaterial",{color:"#f8fafc",roughness:.1,wireframe:t})}),e.jsx(B,{args:[.1,.1,1.4,16],position:[.7,.55,0],rotation:[0,0,-Math.PI/4],children:e.jsx("meshStandardMaterial",{color:"#94a3b8"})}),e.jsx(w,{args:[.5,24,24],position:[-1.4,1.1,0],children:e.jsx("meshStandardMaterial",{color:"#f8fafc",roughness:.1,wireframe:t})}),e.jsx(B,{args:[.1,.1,1.4,16],position:[-.7,.55,0],rotation:[0,0,Math.PI/4],children:e.jsx("meshStandardMaterial",{color:"#94a3b8"})})]}):e.jsxs("group",{ref:s,children:[e.jsx(w,{args:[.85,32,32],position:[0,0,0],children:e.jsx("meshStandardMaterial",{color:"#334155",roughness:.2,wireframe:t})}),[[0,1.6,0],[1.5,-.6,0],[-.8,-.6,1.3],[-.8,-.6,-1.3]].map((i,n)=>e.jsxs("group",{children:[e.jsx(w,{args:[.45,24,24],position:i,children:e.jsx("meshStandardMaterial",{color:"#f8fafc",roughness:.1,wireframe:t})}),e.jsx(B,{args:[.08,.08,1.4,16],position:[i[0]/2,i[1]/2,i[2]/2],rotation:[i[2]===0?0:i[2]>0?.8:-.8,0,i[0]===0?0:i[0]>0?-.8:.8],children:e.jsx("meshStandardMaterial",{color:"#94a3b8"})})]},n))]})}function He({vectorMagnitude:a=2.5,angle:t=45,wireframe:s}){const i=d.useRef();T((f,x)=>{i.current&&(i.current.rotation.y+=x*.15)});const n=t*Math.PI/180,r=a*Math.cos(n),o=a*Math.sin(n),l=a*.5;return e.jsxs("group",{ref:i,children:[e.jsx("gridHelper",{args:[6,12,"#38bdf8","#334155"],position:[0,-1.5,0]}),e.jsx(P,{points:[[-3,-1.5,0],[3,-1.5,0]],color:"#ef4444",lineWidth:3}),e.jsx(P,{points:[[0,-1.5,0],[0,2.5,0]],color:"#22c55e",lineWidth:3}),e.jsx(P,{points:[[0,-1.5,-3],[0,-1.5,3]],color:"#3b82f6",lineWidth:3}),e.jsxs("group",{position:[0,-1.5,0],children:[e.jsx(P,{points:[[0,0,0],[r,o,l]],color:"#f59e0b",lineWidth:5}),e.jsx(w,{args:[.18,16,16],position:[r,o,l],children:e.jsx("meshStandardMaterial",{color:"#f59e0b",emissive:"#b45309",emissiveIntensity:.8})})]}),e.jsx("group",{position:[0,-1.5,0],children:Array.from({length:20}).map((f,x)=>{const u=x/19,p=r*u,h=o*u-.5*1.5*u*u,N=l*u;return e.jsx(w,{args:[.04,8,8],position:[p,Math.max(0,h),N],children:e.jsx("meshStandardMaterial",{color:"#a855f7"})},x)})})]})}function ke(){const[a,t]=d.useState("BIOLOGY"),[s,i]=d.useState("nucleus"),[n,r]=d.useState("H2O"),[o,l]=d.useState(2.5),[f,x]=d.useState(45),[u,p]=d.useState(!1),[h,N]=d.useState(!1),y={nucleus:{nameBn:"নিউক্লিয়াস (Nucleus)",role:"কোষের প্রাণকেন্দ্র বা মস্তিষ্ক",desc:"কোষের সকল শারীরবৃত্তীয় কার্যক্রম ও বংশগতির উপাদান (DNA/RNA) ধারণ ও নিয়ন্ত্রণ করে।"},membrane:{nameBn:"কোষঝিল্লি (Cell Membrane)",role:"বহিঃআবরণ ও সুরক্ষা",desc:"কোষের ভেতরের প্রোটোপ্লাজমকে রক্ষা করে এবং অভিস্রবণের মাধ্যমে পুষ্টি উপাদান গ্রহণ ও বর্জ্য নির্গমন নিয়ন্ত্রণ করে।"},mitochondria:{nameBn:"মাইটোকন্ড্রিয়া (Mitochondria)",role:"কোষের শক্তিঘর (Powerhouse)",desc:"শ্বসন প্রক্রিয়ার মাধ্যমে খাদ্য জারিত করে শক্তি (ATP) উৎপন্ন করে যা কোষের বেঁচে থাকার প্রধান উৎস।"},er:{nameBn:"এন্ডোপ্লাজমিক রেটিকুলাম (ER)",role:"প্রোটিন ও লিপিড পরিবহন",desc:"কোষের ভেতরে সাইটোপ্লাজমীয় পরিবহন কাঠামো হিসেবে কাজ করে এবং রাইবোসোম ধারণ করে।"}};return e.jsxs("div",{className:"space-y-6 text-slate-100",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl",children:[e.jsx("div",{children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"p-2 rounded-2xl bg-amber-500/20 text-amber-400 font-bold",children:e.jsx(fe,{className:"w-6 h-6 animate-spin-slow"})}),e.jsxs("div",{children:[e.jsxs("h2",{className:"text-xl sm:text-2xl font-black text-white flex items-center gap-2",children:["ভার্চুয়াল ৩ডি সায়েন্স ল্যাব",e.jsx("span",{className:"text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",children:"ইন্টারেক্টিভ ৩D"})]}),e.jsx("p",{className:"text-xs text-slate-400 mt-0.5",children:"৩ডি মডেল ঘুরিয়ে ও জুম করে বায়োলজি সেল, কেমিস্ট্রি মলিকিউল ও ফিজিক্স ভেক্টর পর্যবেক্ষণ করুন"})]})]})}),e.jsxs("div",{className:"flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto",children:[e.jsxs("button",{onClick:()=>t("BIOLOGY"),className:`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${a==="BIOLOGY"?"bg-rose-600 text-white shadow-lg shadow-rose-600/30":"text-slate-400 hover:text-slate-200"}`,children:[e.jsx(X,{className:"w-4 h-4"}),"বায়োলজি (কোষ)"]}),e.jsxs("button",{onClick:()=>t("CHEMISTRY"),className:`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${a==="CHEMISTRY"?"bg-blue-600 text-white shadow-lg shadow-blue-600/30":"text-slate-400 hover:text-slate-200"}`,children:[e.jsx(Z,{className:"w-4 h-4"}),"কেমিস্ট্রি (মলিকিউল)"]}),e.jsxs("button",{onClick:()=>t("PHYSICS"),className:`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${a==="PHYSICS"?"bg-amber-600 text-white shadow-lg shadow-amber-600/30":"text-slate-400 hover:text-slate-200"}`,children:[e.jsx(xe,{className:"w-4 h-4"}),"ফিজিক্স (ভেক্টর)"]})]})]}),e.jsxs("div",{className:`grid grid-cols-1 lg:grid-cols-3 gap-6 ${h?"fixed inset-0 z-50 bg-slate-950 p-6":""}`,children:[e.jsxs("div",{className:"lg:col-span-2 relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between",children:[e.jsxs("div",{className:"absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"px-3 py-1 rounded-xl bg-slate-900/90 text-xs font-mono font-bold text-amber-400 border border-slate-700 backdrop-blur-md flex items-center gap-1.5",children:[e.jsx(pe,{className:"w-3.5 h-3.5"}),a==="BIOLOGY"?"3D Animal Cell Structure":a==="CHEMISTRY"?`3D Molecule: ${n}`:"3D Vector Force Field"]}),e.jsx("button",{onClick:()=>p(!u),className:`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${u?"bg-amber-500 text-slate-950 border-amber-400":"bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"}`,children:"Wireframe"})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("button",{onClick:()=>N(!h),className:"p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors",title:h?"Exit Fullscreen":"Fullscreen",children:h?e.jsx(he,{className:"w-4 h-4"}):e.jsx(me,{className:"w-4 h-4"})})})]}),e.jsx("div",{className:"w-full h-[460px] relative cursor-grab active:cursor-grabbing",children:e.jsxs(Ce,{camera:{position:[0,0,6],fov:50},children:[e.jsx("ambientLight",{intensity:.7}),e.jsx("pointLight",{position:[10,10,10],intensity:1.2}),e.jsx("pointLight",{position:[-10,-10,-10],color:"#38bdf8",intensity:.8}),e.jsxs(d.Suspense,{fallback:null,children:[a==="BIOLOGY"&&e.jsx(Re,{organelle:s,setOrganelle:i,wireframe:u}),a==="CHEMISTRY"&&e.jsx(Te,{molType:n,wireframe:u}),a==="PHYSICS"&&e.jsx(He,{vectorMagnitude:o,angle:f,wireframe:u})]}),e.jsx(ze,{enablePan:!0,enableZoom:!0,enableRotate:!0})]})}),e.jsxs("div",{className:"p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 z-10",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-slate-200",children:[e.jsxs("span",{className:"text-amber-400 font-black",children:["🎓 ",R.name]}),e.jsx("span",{children:"•"}),e.jsxs("span",{className:"text-emerald-400",children:["শিক্ষক: ",R.instructor]})]}),e.jsxs("div",{className:"text-[10px] text-slate-500",children:["📞 ",R.contact," | 📍 ",R.address]})]})]}),e.jsxs("div",{className:"space-y-4",children:[a==="BIOLOGY"&&e.jsxs("div",{className:"bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl",children:[e.jsxs("h4",{className:"font-extrabold text-sm text-white flex items-center gap-2",children:[e.jsx(X,{className:"w-4 h-4 text-rose-500"}),"কোষ অঙ্গাণু নির্বাচন ও পর্যবেক্ষণ"]}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:Object.keys(y).map(b=>e.jsx("button",{onClick:()=>i(b),className:`p-2.5 rounded-xl text-xs font-bold transition-all text-left border ${s===b?"bg-rose-500/20 border-rose-500 text-rose-300 shadow-md":"bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`,children:y[b].nameBn.split(" ")[0]},b))}),y[s]&&e.jsxs("div",{className:"p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-black text-rose-400",children:y[s].nameBn}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold",children:y[s].role})]}),e.jsx("p",{className:"text-xs text-slate-300 leading-relaxed",children:y[s].desc})]})]}),a==="CHEMISTRY"&&e.jsxs("div",{className:"bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl",children:[e.jsxs("h4",{className:"font-extrabold text-sm text-white flex items-center gap-2",children:[e.jsx(Z,{className:"w-4 h-4 text-blue-500"}),"মলিকিউলার মডেল নির্বাচন"]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx("button",{onClick:()=>r("H2O"),className:`p-3 rounded-xl text-xs font-bold border transition-all text-center ${n==="H2O"?"bg-blue-600/20 border-blue-500 text-blue-300":"bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`,children:"💧 পানি (H₂O)"}),e.jsx("button",{onClick:()=>r("CH4"),className:`p-3 rounded-xl text-xs font-bold border transition-all text-center ${n==="CH4"?"bg-blue-600/20 border-blue-500 text-blue-300":"bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`,children:"🔥 মিথেন (CH₄)"})]}),e.jsxs("div",{className:"p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs",children:[e.jsx("p",{className:"font-black text-blue-400",children:n==="H2O"?"পানির অণুর গঠন (Bent Shape - 104.5°)":"মিথেন অণুর গঠন (Tetrahedral - 109.5°)"}),e.jsx("p",{className:"text-slate-300 leading-relaxed",children:n==="H2O"?"১টি অক্সিজেন পরমাণুর সাথে ২টি হাইড্রোজেন পরমাণু সমযোজী বন্ধনে আবদ্ধ। নিঃসঙ্গ ইলেকট্রন জোড়ের বিকর্ষণে বন্ধন কোণ ১০৪.৫° হয়।":"১টি কার্বন পরমাণু sp³ সংকরায়নের মাধ্যমে ৪টি হাইড্রোজেন পরমাণুর সাথে চতুস্তলকীয়ভাবে যুক্ত থাকে।"})]})]}),a==="PHYSICS"&&e.jsxs("div",{className:"bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl",children:[e.jsxs("h4",{className:"font-extrabold text-sm text-white flex items-center gap-2",children:[e.jsx(ve,{className:"w-4 h-4 text-amber-500"}),"ভেক্টর মান ও কোণ পরিবর্তন"]}),e.jsxs("div",{className:"space-y-3 text-xs",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between font-bold text-slate-300 mb-1",children:[e.jsx("span",{children:"ভেক্টর মান (Magnitude):"}),e.jsxs("span",{className:"text-amber-400",children:[o.toFixed(1)," N"]})]}),e.jsx("input",{type:"range",min:"1.0",max:"4.5",step:"0.1",value:o,onChange:b=>l(parseFloat(b.target.value)),className:"w-full accent-amber-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between font-bold text-slate-300 mb-1",children:[e.jsx("span",{children:"নিক্ষেপণ কোণ (Angle θ):"}),e.jsxs("span",{className:"text-amber-400",children:[f,"°"]})]}),e.jsx("input",{type:"range",min:"10",max:"80",step:"5",value:f,onChange:b=>x(parseInt(b.target.value)),className:"w-full accent-amber-500"})]})]}),e.jsxs("div",{className:"p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"X-উপাংশ ($V_x$):"})," ",(o*Math.cos(f*Math.PI/180)).toFixed(2)," N"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Y-উপাংশ ($V_y$):"})," ",(o*Math.sin(f*Math.PI/180)).toFixed(2)," N"]})]})]}),e.jsxs("div",{className:"p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-slate-200",children:[e.jsx(ge,{className:"w-4 h-4 text-amber-400"}),"ল্যাব নির্দেশিকা"]}),e.jsxs("p",{className:"leading-relaxed text-[11px]",children:["• মাউস বা আঙুল দিয়ে ড্র্যাগ করে ৩ডি মডেলটি ৩৬০° ঘুরিয়ে দেখুন।",e.jsx("br",{}),"• স্ক্রল করে জুম-ইন ও জুম-আউট করুন।"]})]})]})]})]})}export{ke as default};
