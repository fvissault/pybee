from packages.errors.core_errors import core_errors
from packages.errors.web_errors import web_errors
from packages.base_module import base_module
from packages.help.web_help import web_help
import re
from collections import defaultdict
import http.cookies
import uuid
import urllib.parse
import json
import os
from datetime import datetime, timedelta

class web(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        #print(interpreter)
        self.dictionary = {'generate' : '''dup "tag" cell@ local tag dup "content" cell@ local content dup "attrs" cell@ local attrs "container" cell@ local container 0 local item 0 local i 0 local k 0 local v tag @ "comment" = if "<!--<#0#>-->" [ content @ 0 cell@ ] format .cr else tag @ "html" = if session? invert if htmlcontent then "<!DOCTYPE html>" .cr then "<<#0#>" [ tag @ ] format . attrs @ cells 0 > if attrs @ keys k ! attrs @ values v ! k @ cells i do k @ i @ cell@ v @ i @ cell@ = if " <#0#>" [ k @ i @ cell@ ] format . else " <#0#>='<#1#>'" [ k @ i @ cell@ v @ i @ cell@ ] format . then loop then container @ "y" = if ">" . 0 i ! content @ cells i do content @ i @ cell@ item ! item @ ?str if item @ . else item @ generate then loop else "/>" .cr then container @ "y" = if "</<#0#>>" [ tag @ ] format .cr then then''',
                           'webreset' : '''"html" ?var if forget html then "head" ?var if forget head then "title" ?var if forget title then "body" ?var if forget body then "form1" ?var if forget form1 then { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head "UTF-8" charset addcontent head "width=device-width,initial-scale=1.0" "viewport" meta addcontent { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body html head addcontent html body addcontent { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title head title addcontent { tag : "form" , content : [ ] , attrs : { action : "" , method : "post" } , container : "y" } var form1 cls''',
                           'addcontent' : '''local toadd local where toadd @ ?array invert if toadd @ ?var toadd @ ?local or if toadd @ @ toadd ! then then "content" toadd @ where @ cell+ drop''',
                           'addattr' : '''rot @ "attrs" cell@ cell+ drop''',
                           'fieldarea' : '''{ } local attrs local fatype local favalue local faid "type" fatype @ attrs cell+ drop "value" favalue @ attrs cell+ drop "id" faid @ attrs cell+ drop "name" faid @ attrs cell+ drop { tag : "input" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'div' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "div" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'label' : '''{ } local attrs "for" swap attrs cell+ drop local content { tag : "label" , content : [ content @ ] , attrs : attrs @ , container : "y" }''',
                           'headlink' : '''{ } local attrs "href" swap attrs cell+ drop "rel" "stylesheet" attrs cell+ drop { tag : "link" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'headscriptfile' : '''local src { } local attrs "src" src @ attrs cell+ drop { tag : "script" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'script': '''local cont local mode { } local attrs mode @ "defer" = if "defer" mode @ attrs cell+ drop then mode @ "async" = if "async" mode @ attrs cell+ drop then { tag : "script" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'img' : '''{ } local attrs "src" swap attrs cell+ drop { tag : "img" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'textarea' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "textarea" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'br' : '''{ tag : "br" , content : [ ] , attrs : [ ] , container : "n" }''',
                           'select' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "select" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'option' : '''{ } local attrs dup "y" = if "selected" swap attrs cell+ then drop "value" swap attrs cell+ drop local cont { tag : "option" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'a' : '''{ } local attrs "href" swap attrs cell+ drop local cont { tag : "a" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'button' : '''{ } local attrs local buttontype local cont "type" buttontype @ attrs cell+ drop { tag : "button" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'header' : '''{ tag : "header" , content : [ ] , attrs : { } , container : "y" }''',
                           'footer' : '''{ tag : "footer" , content : [ ] , attrs : { } , container : "y" }''',
                           'article' : '''{ tag : "article" , content : [ ] , attrs : { } , container : "y" }''',
                           'style' : '''local cont { tag : "style" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'paragraph' : '''local cont { tag : "p" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'maintitle' : '''local cont local size { tag : "h<#0#>" [ size @ ] format , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'span' : '''local cont { tag : "span" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'strong' : '''local cont { tag : "strong" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'small' : '''local cont { tag : "small" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'underline' : '''local cont { tag : "u" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'table' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "table" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'tablerow' : '''{ tag : "tr" , content : [ ] , attrs : { } , container : "y" }''',
                           'tablecell' : '''local cont { tag : "td" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'tablehead' : '''local cont { tag : "th" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'unorderlist' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "ul" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'orderlist' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "ol" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'listitem' : '''local cont { tag : "li" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'urlbase' : '''{ } local attrs "target" rot attrs cell+ drop "href" rot attrs cell+ drop { tag : "base" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'charset' : '''local charset { } local attrs "charset" charset @ attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'httpequiv' : '''local content local httpequiv { } local attrs "http-equiv" httpequiv @ attrs cell+ drop "content" content @ attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'meta' : '''{ } local attrs local name local content "name" name @ attrs cell+ drop "content" content @ attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'comment' : '''local cont { tag : "comment" , content : [ cont @ ] , attrs : { } , container : "n" }''',
                           'abbr': '''local title local cont { } local attrs "title" title @ attrs cell+ drop { tag : "abbr" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'address': '''{ tag : "address" , content : [ ] , attrs : { } , container : "y" }''',
                           'area': '''local href local coords local shape { } local attrs "shape" shape @ attrs cell+ drop "coords" coords @ attrs cell+ drop "href" href @ attrs cell+ drop { tag : "area" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'map': '''local name { } local attrs "name" name @ attrs cell+ drop { tag : "map" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'aside': '''{ tag : "aside" , content : [ ] , attrs : { } , container : "y" }''',
                           'audio': '''local muted local inloop local autoplay local controls { } local attrs controls @ "controls" = if "controls" controls @ attrs cell+ drop then autoplay @ "autoplay" = if "autoplay" autoplay @ attrs cell+ drop then inloop @ "loop" = if "loop" inloop @ attrs cell+ drop then muted @ "muted" = if "muted" muted @ attrs cell+ drop then { tag : "audio" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'source': '''local sourcetype local src { } local attrs "src" src @ attrs cell+ drop "type" sourcetype @ attrs cell+ drop { tag : "source" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'pictsrc': '''local srcset local media { } local attrs "media" media @ attrs cell+ drop "scset" srcset @ attrs cell+ drop { tag : "source" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'bold': '''local cont { tag : "b" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'bdo': '''local dir local cont { } local attrs "dir" dir @ attrs cell+ drop { tag : "bdo" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'blockquote': '''local cont { tag : "blockquote" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'canvas': '''local id { } local attrs "id" id @ attrs cell+ drop { tag : "canvas" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'caption': '''local cont { tag : "caption" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'cite': '''local cont { tag : "cite" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'code': '''local cont { tag : "code" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'col': '''local colspan { } local attrs colspan @ 1 > if "span" colspan @ attrs cell+ drop then { tag : "col" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'colgroup': '''{ tag : "colgroup" , content : [ ] , attrs : { } , container : "y" }''',
                           'data': '''local value local cont { } local attrs "value" value @ attrs cell+ drop { tag : "data" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'datalist': '''local id { } local attrs "id" id @ attrs cell+ drop { tag : "datalist" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'dloption': '''local value { } local attrs "value" value @ attrs cell+ drop { tag : "option" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'dl': '''{ tag : "dl" , content : [ ] , attrs : { } , container : "y" }''',
                           'dt': '''local cont { tag : "dt" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'dd': '''local cont { tag : "dd" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'del': '''local cont { tag : "del" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'details': '''local cont local open { } local attrs open @ "open" = if "open" open @ attrs cell+ drop then { tag : "details" , content : [ { tag : "summary" , content : [ cont @ ], attrs : { }, container : "y" } ] , attrs : attrs @ , container : "y" }''',
                           'dfn': '''local cont { tag : "dfn" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'dialog': '''local open local cont { } local attrs open @ "open" = if "open" open @ attrs cell+ drop then { tag : "dialog" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'em': '''local cont { tag : "em" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'fieldset': '''local disabled local name { } local attrs disabled @ "disabled" = if "disabled" disabled @ attrs cell+ drop then "name" name @ attrs cell+ drop { tag : "fieldset" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'figcaption': '''local cont { tag : "figcaption" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'figure': '''{ tag : "figure" , content : [ ] , attrs : { } , container : "y" }''',
                           'form': '''local method local action { } local attrs "action" action @ attrs cell+ drop "method" method @ attrs cell+ drop { tag : "form" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'hr': '''{ tag : "hr" , content : [ ] , attrs : { } , container : "n" }''',
                           'italic': '''local cont { tag : "i" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'iframe': '''local src { } local attrs "src" src @ attrs cell+ drop { tag : "iframe" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'ins': '''local cont { tag : "ins" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'kbd': '''local cont { tag : "kbd" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'legend': '''local cont { tag : "legend" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'main': '''{ tag : "main" , content : [ ] , attrs : { } , container : "y" }''',
                           'mark': '''local cont { tag : "mark" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'menu': '''{ tag : "menu" , content : [ ] , attrs : { } , container : "y" }''',
                           'meter': '''local id local value local min local max local cont { } local attrs max @ 0= invert if "max" max @ attrs cell+ drop then min @ 0= invert if "min" min @ attrs cell+ drop then "value" value @ attrs cell+ drop "id" id @ attrs cell+ drop { tag : "meter" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'nav': '''{ tag : "nav" , content : [ ] , attrs : { } , container : "y" }''',
                           'noscript': '''local cont { tag : "noscript" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'optgroup': '''local label local disabled { } local attrs disabled @ "disabled" = if "disabled" disabled @ attrs cell+ drop then "label" label @ attrs cell+ drop { tag : "optgroup" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'picture': '''{ tag : "picture" , content : [ ] , attrs : { } , container : "y" }''',
                           'pre': '''local cont { tag : "pre" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'quote': '''local cont { tag : "q" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'section': '''{ tag : "section" , content : [ ] , attrs : { } , container : "y" }''',
                           'sub': '''local cont { tag : "sub" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'summary': '''local cont { tag : "summary" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'sup': '''local cont { tag : "sup" , content : [ cont @ ] , attrs : { } , container : "y" }''',
                           'svg': '''''',
                           'svgrect': '''''',
                           'svgpolygon': '''''',
                           'svgellipse': '''''',
                           'svgcircle': '''''',
                           'svgline': '''''',
                           'svgpolyline': '''''',
                           'svgpath': '''''',
                           'svgtext': '''''',
                           'svgtextpath': '''''',
                           'svgimage': '''''',
                           'svgmarker': '''''',
                           'svglineargradient': '''''',
                           'svgradialgradient': '''''',
                           'svgpattern': '''''',
                           'video': '''local muted local inloop local autoplay local controls { } local attrs controls @ "controls" = if "controls" controls @ attrs cell+ drop then autoplay @ "autoplay" = if "autoplay" autoplay @ attrs cell+ drop then inloop @ "loop" = if "loop" inloop @ attrs cell+ drop then muted @ "muted" = if "muted" muted @ attrs cell+ drop then { tag : "video" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'layoutgrid' : '''local content local type "laystyle" ?var if type @ "other" = invert if laystyle "#parentlayout { grid-<#0#>: <#1#>; }" [ type @ content @ ] format addcontent else laystyle "#parentlayout { <#0#>; }" [ content @ ] format addcontent then then''',
                           'layoutarea' : '''local content local areanum local type "laystyle" ?var if type @ "other" = invert if laystyle "#z<#0#> { grid-area: <#1#>; }" [ areanum @ content @ ] format addcontent else laystyle "#z<#0#> { <#1#>; }" [ areanum @ content @ ] format addcontent then then''',
                           'layout' : '''local zonecount var pagename 0 local i "html" ?var if forget html then "head" ?var if forget head then "title" ?var if forget title then "body" ?var if forget body then { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head "UTF-8" charset addcontent head "width=device-width,initial-scale=1.0" "viewport" meta addcontent { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body "parentlayout" div local container zonecount @ i do "z<#0#>" [ i @ ] format div "var z<#0#>" [ i @ ] format evaluate container @ "z<#0#>" [ i @ ] format addcontent loop body container @ addcontent "#parentlayout { display: grid; }" style var laystyle html head addcontent html body addcontent { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title head title addcontent cls''',
                           'savelaystyle' : '''local where where @ "inline" = if head laystyle addcontent else head "userarea/css/<#0#>.css" [ pagename @ ] format headlink addcontent "cssfile" "css/<#0#>.css" [ pagename @ ] format overwritetofile laystyle "content" cell@ 0 cell@ "cssfile" writein "cssfile" closefile then''',
                           'grouplaystyle' : self.grouplaystyle_instr,
                           'posted' : self.paramget_instr,
                           'redirect' : self.redirect_instr,
                           'htmlcontent' : self.htmlcontent_instr,
                           'session' : self.session_instr,
                           'getsession' : self.getsession_instr,
                           'setsessvar' : self.setsessvar_instr,
                           'getsessvar' : self.getsessvar_instr,
                           'session?' : self.usecookies_instr,
                           'setsessduration' : self.setsessduration_instr,
                           'sessduration?' : self.sessduration_instr,
                           'completeselect' : '''select local tempselect 0 local i 0 local item 0 local opt dup cells i do dup i @ cell@ item ! item @ 2 cell@ item @ 1 cell@ item @ 0 cell@ option opt ! "content" opt @ tempselect cell+ drop loop drop tempselect @''',
                           'card' : '''local name local container "card<#0#>" [ name @ ] format local newname name @ div "var <#0#>" [ newname @ ] format evaluate newname @ "class" "simple-card" addattr drop container @ newname @ addcontent''',
                           'addcardtitle' : '''local content local container "title<#0#>" [ container @ ] format div local titlecontainer titlecontainer "class" "simple-card-title" addattr titlecontainer content @ addcontent container @ titlecontainer addcontent''',
                           'addcardbody' : '''local content local container "body<#0#>" [ container @ ] format div local bodycontainer bodycontainer "class" "simple-card-body" addattr bodycontainer content @ addcontent container @ bodycontainer addcontent''',
                           'addcardbottom' : '''local content local container "bottom<#0#>" [ container @ ] format div local bottomcontainer bottomcontainer "class" "simple-card-bottom" addattr bottomcontainer content @ addcontent container @ bottomcontainer addcontent''',
                           'flipcard' : '''local name local container name @ div local flipcard flipcard "class" "flip-card" addattr flipcard "fci<#0#>" [ name @ ] format div local cardinner cardinner @ addcontent cardinner "class" "flip-card-inner" addattr cardinner "fcf<#0#>" [ name @ ] format div "var fcf<#0#>" [ name @ ] format evaluate @ addcontent "fcf<#0#>" [ name @ ] format "class" "flip-card-front" addattr cardinner "fcb<#0#>" [ name @ ] format div "var fcb<#0#>" [ name @ ] format evaluate @ addcontent "fcb<#0#>" [ name @ ] format "class" "flip-card-back" addattr container @ flipcard @ addcontent''',
                           'profilecard' : '''local name "profile<#0#>" [ name @ ] format local newname name @ div "var <#0#>" [ newname @ ] format evaluate newname @ "class" "profile-card" addattr drop newname @''',
                           'productcard' : '''local name "product<#0#>" [ name @ ] format local newname name @ div "var <#0#>" [ newname @ ] format evaluate newname @ "class" "product-card" addattr drop newname @''',
                           'versplitter' : '''local name local container "<#0#>left" [ name @ ] format local leftid "<#0#>right" [ name @ ] format local rigthid "<#0#>divider" [ name @ ] format local dividerid leftid @ div "var <#0#>" [ leftid @ ] format evaluate leftid @ "class" "splitleft" addattr rigthid @ div "var <#0#>" [ rigthid @ ] format evaluate rigthid @ "class" "splitright" addattr dividerid @ div "var <#0#>" [ dividerid @ ] format evaluate dividerid @ "class" "splitverticaldivider" addattr container @ leftid @ addcontent container @ dividerid @ addcontent container @ rigthid @ addcontent container @ "defer" "const <#0#>=new Splitter(\"<#1#>\",\"<#2#>\",\"vertical\");" [ name @ dividerid @ leftid @ ] format script addcontent''',
                           'horsplitter' : '''local name local container "<#0#>top" [ name @ ] format local topid "<#0#>bottom" [ name @ ] format local bottomid "<#0#>divider" [ name @ ] format local dividerid topid @ div "var <#0#>" [ topid @ ] format evaluate topid @ "class" "splittop" addattr bottomid @ div "var <#0#>" [ bottomid @ ] format evaluate bottomid @ "class" "splitbottom" addattr dividerid @ div "var <#0#>" [ dividerid @ ] format evaluate dividerid @ "class" "splithorizontaldivider" addattr container @ topid @ addcontent container @ dividerid @ addcontent container @ bottomid @ addcontent container @ "defer" "const <#0#>=new Splitter(\"<#1#>\",\"<#2#>\",\"horizontal\");" [ name @ dividerid @ topid @ ] format script addcontent''',
                           'divider' : '''local type local name local container type @ "double" = type @ "dashed" = or type @ "dotted" = or type @ "solid" = or type @ "rounded" = or if "<#0#>divider" [ name @ ] format local dividername hr "var <#0#>" [ dividername @ ] format evaluate dividername @ "class" "<#0#>-divider" [ type @ ] format addattr container @ dividername @ addcontent then''',
                           'overlay' : '''local name "<#0#>overlay" [ name @ ] format local overlayname name @ div "var <#0#>" [ overlayname @ ] format evaluate overlayname @ "class" "overlay" addattr body overlayname @ addcontent''',
                           'toptab' : '''local name local defaultopen local buttontab local container name @ div local buttondiv buttondiv "class" "tab" addattr 0 local i 0 local value 0 local color 0 local item buttontab @ cells i do "<#0#>tab<#1#>" [ name @ i @ ] format local buttonid buttontab @ i @ cell@ item ! item @ 0 cell@ value ! item @ 1 cell@ color ! value @ "button" button local bouton i @ defaultopen @ = if "tablinks defaultOpen" local boutonclass else "tablinks" local boutonclass then bouton "class" boutonclass @ addattr bouton "onclick" "openTab(event,\"<#0#>\",this,\"<#1#>\")" [ buttonid @ color @ ] format addattr buttondiv @ bouton @ addcontent loop container @ buttondiv @ addcontent 0 local tabid 0 i ! buttontab @ cells i do "<#0#>tab<#1#>" [ name @ i @ ] format tabid ! tabid @ div "var <#0#>" [ tabid @ ] format evaluate tabid "class" "tabcontent" addattr container @ tabid @ addcontent loop container "onload" "showDefault()" addattr'''
                           }
        self.help = web_help(self.interpreter.output)
        self.sessionvars = {'session_duration':30}
        self.usecookies = False
        self.version = 'v1.3.5'

    '''
    Instruction grouplaystyle : regroupe les définitions qui portent le même sélecteur dans le css d'un layout
    la variable 'laystyle' doit impértivement exister
    '''
    def grouplaystyle_instr(self):
        for p in self.interpreter.packages.keys():
            if 'laystyle' in self.interpreter.packages[p].variables:
                content = "\n".join(self.interpreter.packages[p].dictionary['laystyle']['content'])
                blocs = re.findall(r'([^{]+)\{([^}]+)\}', content)
                regles = defaultdict(list)
                for selecteur, declarations in blocs:
                    selecteur = selecteur.strip()
                    declarations = declarations.strip()
                    regles[selecteur].append(declarations)
                result = ''
                for selecteur, listes_declarations in regles.items():
                    result += f"{selecteur} {{\n\t"
                    toutes_declarations = "\n\t".join(listes_declarations)
                    result += toutes_declarations.strip() + "\n"
                    result += "}\n"
                self.interpreter.packages[p].dictionary['laystyle']['content'] = [result.strip("\n")]
                return 'nobreak'
        return web_errors.error_laystyle_not_found.print_error('grouplaystyle', self.interpreter.output)

    '''
    Instruction posted : permet de récupérer un paramètre passé entre les pages
    '''
    def paramget_instr(self):
        if len(self.work) > 0:
            paramname = self.pop_work()
            fstorage = self.interpreter.params
            if fstorage[paramname] != None:
                value = fstorage[paramname]
                if value == None:
                    return core_errors.error_nothing_to_evaluate.print_error('posted', self.interpreter.output)
                self.work.appendleft(value)
                return 'nobreak'
            else:
                return core_errors.error_nothing_to_evaluate.print_error('posted', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('posted', self.interpreter.output)

    '''
    Instruction redirect : effectuer une redirection
    '''
    def redirect_instr(self):
        if len(self.work) > 0:
            url = self.pop_work()
            print("Location: {0}\n".format(url))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('redirect', self.interpreter.output)

    '''
    Instruction htmlcontent : précise que le contenu de la page est du code html : fonction utilisée dans generate
    '''
    def htmlcontent_instr(self):
        print("Content-type: text/html;charset=UTF-8\n")
        return 'nobreak'

    '''
    Instruction session : créer une session
    '''
    def session_instr(self):
        if len(self.work) > 1:
            name = str(self.pop_work())
            cookie = http.cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
            if name in cookie:
                session_cookie = cookie.get(name).value
                if os.path.isfile(f"userarea/tmp/s{session_cookie}"):
                    os.remove(f"userarea/tmp/s{session_cookie}")
            param = self.pop_work()
            valeur = json.dumps(self.sessionvars)
            session_id = str(uuid.uuid4())
            if 'session_duration' in self.sessionvars:
                duration = self.sessionvars['session_duration']
            else:
                duration = 30
            expiredate = (datetime.now() + timedelta(minutes=duration)).strftime("%a, %d-%b-%Y %H:%M:%S GMT")
            self.usecookies = True
            with open(f"userarea/tmp/s{session_id}", "w") as f:
                f.write(valeur)
                f.close()            
            if param == 'redirect':
                print("Status: 302 Found")
            else:
                print("Content-Type: text/html;charset=UTF-8")
            cookie = http.cookies.SimpleCookie()
            cookie[name] = session_id
            cookie[name]["path"] = "/"
            cookie[name]["httponly"] = True
            cookie[name]["Max-Age"] = str(duration * 60)
            cookie[name]["Expires"] = expiredate
            print(cookie.output())
            if param != 'redirect':
                print()
        else:
            return core_errors.error_nothing_in_work_stack.print_error('redirect', self.interpreter.output)
        return 'nobreak'

    '''
    Instruction getsession : charge les variables de session si elle existe
    '''
    def getsession_instr(self):
        if len(self.work) > 0:
            name = str(self.pop_work())
            cookie = http.cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
            if name in cookie:
                session_cookie = cookie.get(name).value
                with open(f"userarea/tmp/s{session_cookie}", "r") as f:
                    sessionvars = f.read()
                    self.sessionvars = json.loads(sessionvars)
                    f.close()
            else:
                self.sessionvars =  {}
        else:
            return core_errors.error_nothing_in_work_stack.print_error('getsession', self.interpreter.output)
        return 'nobreak'

    '''
    Instruction setsessvar : créer une variable de session
    '''
    def setsessvar_instr(self):
        if len(self.work) > 1:
            value = self.pop_work()
            key = self.pop_work()
            self.sessionvars[key] = value
        else:
            return core_errors.error_nothing_in_work_stack.print_error('setsessvar', self.interpreter.output)
        return 'nobreak'

    '''
    Instruction getsessvar : positionne la valeur d'une variable de session sur la pile de travail si elle existe
    '''
    def getsessvar_instr(self):
        if len(self.work) > 0:
            key = self.pop_work()
            self.work.appendleft(self.sessionvars[key])
        else:
            return core_errors.error_nothing_in_work_stack.print_error('setsessvar', self.interpreter.output)
        return 'nobreak'

    '''
    Instruction usecookie? : positionne sur la pile de travail si une session a été créée
    '''
    def usecookies_instr(self):
        if self.usecookies == True:
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
        return 'nobreak'

    '''
    Instruction setsessduration : fixe la durée de validitaé d'une session : par défaut c'est 30 minutes et la minute est l'unité
    '''
    def setsessduration_instr(self):
        if len(self.work) > 0:
            duration = int(self.pop_work())
            self.sessionvars['session_duration'] = duration
        else:
            return core_errors.error_nothing_in_work_stack.print_error('redirect', self.interpreter.output)
        return 'nobreak'
    
    '''
    Instruction sessduration? : positionne sur la pile de travail la durée de validité des sessions : par défaut ce sera 30 minutes
    '''
    def sessduration_instr(self):
        self.work.appendleft(self.sessionvars['session_duration'])
        return 'nobreak'