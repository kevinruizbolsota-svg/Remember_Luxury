/* AXEL MIND v1.1 — internal cognitive architecture + multimodal bridge */
(function(){
  'use strict';
  const MIND={
    version:'1.1.0',
    identity:{name:'AXEL',role:'núcleo operativo y compañero de trabajo',language:'es',tone:'natural, directo, cálido y con criterio'},
    principles:['Comprender la intención antes de responder.','Distinguir hechos, inferencias y propuestas.','No inventar capacidades, datos, acciones ni resultados.','Si falta información, pedir solo lo imprescindible.','Priorizar la solución útil sobre respuestas genéricas.','Mantener continuidad con el proyecto y su contexto.','No revelar secretos, credenciales ni razonamiento interno privado.'],
    departments:{conversation:'Habla con el usuario, interpreta intención y mantiene continuidad.',reasoning:'Analiza problemas, compara opciones y propone decisiones justificadas.',memory:'Clasifica recuerdos útiles: preferencias, hechos del proyecto, decisiones y tareas.',project:'Convierte ideas en objetivos, fases, tareas, dependencias y verificaciones.',agents:'Coordina agentes especializados y evita duplicar trabajo.',guardian:'Supervisa seguridad, permisos, fallos, límites y acciones sensibles.',research:'Separa información comprobada de hipótesis y fuentes externas.',builder:'Transforma decisiones aprobadas en cambios concretos y verificables.',commerce:'Gestiona lógica de tienda, AWIN, productos y oportunidades comerciales.'},
    routing:[{match:['hola','hey','buenas','oe','oeeee'],dept:'conversation'},{match:['por qué','porque','explica','analiza','compara','decidir'],dept:'reasoning'},{match:['recuerda','memoria','guardar','acuérdate'],dept:'memory'},{match:['proyecto','fase','tarea','construye','haz','termina'],dept:'project'},{match:['seguridad','clave','api key','permiso','guardian'],dept:'guardian'},{match:['investiga','busca','fuente','verifica'],dept:'research'},{match:['github','código','archivo','commit','página'],dept:'builder'},{match:['awin','tienda','producto','comisión'],dept:'commerce'}],
    classify(text){const t=String(text||'').toLowerCase();for(const r of this.routing)if(r.match.some(k=>t.includes(k)))return r.dept;return'conversation'},
    buildContext(input){const memories=Array.isArray(input&&input.memories)?input.memories:[];const d=this.classify(input&&input.message);return{department:d,identity:this.identity,principles:this.principles,departmentRule:this.departments[d],relevantMemory:memories.slice(-12)}}
  };
  window.AXEL_MIND=MIND;
  const pending=[];
  function hookFiles(){
    const f=document.getElementById('file');if(!f||f.dataset.axelMindHooked)return;f.dataset.axelMindHooked='1';
    f.addEventListener('change',async()=>{
      pending.length=0;
      for(const file of Array.from(f.files||[]).slice(0,6)){
        if(file.size>5*1024*1024)continue;
        if(file.type.startsWith('image/')){
          const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
          pending.push({name:file.name,type:file.type,data});
        }else if(file.type.startsWith('text/')||/\.(txt|md|csv|json|js|html|css)$/i.test(file.name)){
          pending.push({name:file.name,type:file.type||'text/plain',text:(await file.text()).slice(0,120000),data:'text:'+file.name});
        }
      }
      window.AXEL_PENDING_ATTACHMENTS=pending.slice();
    });
  }
  const nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    try{
      const url=typeof input==='string'?input:input.url;
      if(url&&/\/functions\/v1\/axel-ai(?:$|\?)/.test(url)&&init&&typeof init.body==='string'){
        const body=JSON.parse(init.body);body.mind=JSON.stringify(MIND.buildContext({message:body.message,memories:body.memories||[]}));
        if(pending.length)body.attachments=pending.slice(0,6);init.body=JSON.stringify(body);
      }
    }catch(e){}
    return nativeFetch(input,init);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hookFiles);else hookFiles();
})();
