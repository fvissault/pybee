from packages.errors.core_errors import core_errors
from packages.errors.web_errors import web_errors
from packages.base_module import base_module
from packages.help.web_help import web_help
import re
from collections import defaultdict

class web(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'generate' : '''dup "tag" cell@ local tag dup "content" cell@ local content dup "attrs" cell@ local attrs "container" cell@ local container 0 local item 0 local i 0 local k 0 local v tag @ "comment" = if "<!--<#0#>-->" [ content @ 0 cell@ ] format .cr else tag @ "html" = if "<!DOCTYPE html>" .cr then "<<#0#>" [ tag @ ] format . attrs @ cells 0 > if attrs @ keys k ! attrs @ values v ! k @ cells i do " <#0#>='<#1#>'" [ k @ i @ cell@ v @ i @ cell@ ] format . loop then container @ "y" = if ">" .cr 0 i ! content @ cells i do content @ i @ cell@ item ! item @ ?str if item @ .cr else item @ generate then loop else "/>" .cr then container @ "y" = if "</<#0#>>" [ tag @ ] format .cr then then''',
                           'webreset' : '''"html" ?var if forget html then "head" ?var if forget head then "title" ?var if forget title then "body" ?var if forget body then "form" ?var if forget form then { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body html head addcontent html body addcontent { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title head title addcontent { tag : "form" , content : [ ] , attrs : { action : "" , method : "post" } , container : "y" } var form cls''',
                           'addcontent' : '''dup ?var dup ?local or if @ then "content" reverse cell+''',
                           'addattr' : '''rot @ "attrs" cell@ cell+''',
                           'fieldarea' : '''{ } local attrs "type" swap attrs cell+ drop "value" swap attrs cell+ drop "id" swap attrs cell+ drop { tag : "input" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'div' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "div" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'label' : '''{ } local attrs "for" swap attrs cell+ drop local content { tag : "label" , content : [ content @ ] , attrs : attrs @ , container : "y" }''',
                           'headlink' : '''{ } local attrs "href" swap attrs cell+ drop "rel" "stylesheet" attrs cell+ drop { tag : "link" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'headscriptfile' : '''{ } local attrs "src" swap attrs cell+ drop { tag : "script" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'img' : '''{ } local attrs "src" swap attrs cell+ drop { tag : "img" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'textarea' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "textarea" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'br' : '''{ tag : "br" , content : [ ] , attrs : [ ] , container : "n" }''',
                           'select' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "select" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'option' : '''{ } local attrs dup "y" = if "selected" swap attrs cell+ then drop "value" swap attrs cell+ drop local cont { tag : "option" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'a' : '''{ } local attrs "href" swap attrs cell+ drop local cont { tag : "a" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'completeselect' : '''select local tempselect 0 local i 0 local item 0 local opt dup cells i do dup i @ cell@ item ! item @ 2 cell@ item @ 1 cell@ item @ 0 cell@ option opt ! "content" opt @ tempselect cell+ drop loop drop tempselect @''',
                           'button' : '''{ } local attrs "onclick" rot attrs cell+ drop "type" rot attrs cell+ drop local cont { tag : "button" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
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
                           'charset' : '''{ } local attrs "charset" rot attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'httpequiv' : '''{ } local attrs "http-equiv" rot attrs cell+ drop "content" rot attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'meta' : '''{ } local attrs "name" rot attrs cell+ drop "content" rot attrs cell+ drop { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'comment' : '''local cont { tag : "comment" , content : [ cont @ ] , attrs : { } , container : "n" }''',
                           'abbr': '''local cont local title { } local attrs "title" title @ attrs cell+ drop { tag : "abbr" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
                           'address': '''{ tag : "address" , content : [ ] , attrs : { } , container : "y" }''',
                           'area': '''local href local coords local shape { } local attrs "shape" shape @ attrs cell+ drop "coords" coords @ attrs cell+ drop "href" href @ attrs cell+ drop { tag : "area" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'map': '''local name { } local attrs "name" name @ attrs cell+ drop { tag : "map" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'article': '''''',
                           'aside': '''''',
                           'audio': '''''',
                           'source': '''''',
                           'bold': '''''',
                           'bold': '''''',
                           'bdo': '''''',
                           'blockquote': '''''',
                           'canvas': '''''',
                           'caption': '''''',
                           'cite': '''''',
                           'code': '''''',
                           'col': '''''',
                           'colgroup': '''''',
                           'data': '''''',
                           'datalist': '''''',
                           'dl': '''''',
                           'dt': '''''',
                           'dd': '''''',
                           'del': '''''',
                           'details': '''''',
                           'dfn': '''''',
                           'dialog': '''''',
                           'em': '''''',
                           'embed': '''''',
                           'fieldset': '''''',
                           'figcaption': '''''',
                           'figure': '''''',
                           'footer': '''''',
                           'form': '''''',
                           'hr': '''''',
                           'italic': '''''',
                           'iframe': '''''',
                           'ins': '''''',
                           'kbd': '''''',
                           'legend': '''''',
                           'main': '''''',
                           'mark': '''''',
                           'menu': '''''',
                           'meter': '''''',
                           'nav': '''''',
                           'noscript': '''''',
                           'object': '''''',
                           'optgroup': '''''',
                           'output': '''''',
                           'param': '''''',
                           'picture': '''''',
                           'pre': '''''',
                           'progress': '''''',
                           'quote': '''''',
                           'samp': '''''',
                           'section': '''''',
                           'sub': '''''',
                           'summary': '''''',
                           'sup': '''''',
                           'svg': '''''',
                           'template': '''''',
                           'video': '''''',
                           'layoutgrid' : '''local content local type "laystyle" ?var if type @ "other" = invert if laystyle "#parentlayout { grid-<#0#>: <#1#>; }" [ type @ content @ ] format addcontent else laystyle "#parentlayout { <#0#>; }" [ content @ ] format addcontent then then''',
                           'layoutarea' : '''local content local areanum local type "laystyle" ?var if type @ "other" = invert if laystyle "#z<#0#> { grid-area: <#1#>; }" [ areanum @ content @ ] format addcontent else laystyle "#z<#0#> { <#1#>; }" [ areanum @ content @ ] format addcontent then then''',
                           'layout' : '''local zonecount var pagename 0 local i "html" ?var if forget html then "head" ?var if forget head then "title" ?var if forget title then "body" ?var if forget body then { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body "parentlayout" div local container zonecount @ i do "z<#0#>" [ i @ ] format div "var z<#0#>" [ i @ ] format evaluate container @ "z<#0#>" [ i @ ] format addcontent loop body container @ addcontent "#parentlayout { display: grid; }" style var laystyle html head addcontent html body addcontent { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title head title addcontent cls''',
                           'savelaystyle' : '''local where where @ "inlinestyle" = if head laystyle addcontent else head "css/<#0#>.css" [ pagename @ ] format headlink addcontent "cssfile" "css/<#0#>.css" [ pagename @ ] format overwritetofile laystyle "content" cell@ 0 cell@ "cssfile" writein "cssfile" closefile then''',
                           'grouplaystyle' : self.grouplaystyle_instr
                           }
        self.help = web_help(self.interpreter.output)
        self.version = 'v1.1.3'

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
