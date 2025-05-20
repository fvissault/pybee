from packages.errors.core_errors import core_errors
from packages.errors.web_errors import web_errors
from packages.base_module import base_module
from packages.help.web_help import web_help

class web(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'generate' : '''dup "tag" cell@ local tag dup "content" cell@ local content dup "attrs" cell@ local attrs "container" cell@ local container 0 local item 0 local i 0 local k 0 local v tag @ "html" = if "<!DOCTYPE html>" .cr then "<<!0!>" [ tag @ ] format . attrs @ cells 0 > if attrs @ keys k ! attrs @ values v ! k @ cells i do " <!0!>='<!1!>'" [ k @ i @ cell@ v @ i @ cell@ ] format . loop then container @ "y" = if ">" .cr 0 i ! content @ cells i do content @ i @ cell@ item ! item @ ?str	if item @ .cr else item @ generate then	loop else "/>" .cr then	container @ "y" = if "</<!0!>>" [ tag @ ] format .cr then''',
                           'webreset' : '''"html" ?var if forget html then "head" ?var if forget head then "title" ?var if forget title then "body" ?var if forget body then "form" ?var if forget form then { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body html head addcontent html body addcontent { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title head title addcontent { tag : "form" , content : [ ] , attrs : { action : "" , method : "post" } , container : "y" } var form cls''',
                           'addcontent' : '''dup ?var dup ?local or if @ then "content" reverse cell+''',
                           'addattr' : '''rot @ "attrs" cell@ cell+''',
                           'field' : '''{ } local attrs "type" swap attrs cell+ drop "value" swap attrs cell+ drop "id" swap attrs cell+ drop { tag : "input" , content : [ ] , attrs : attrs @ , container : "n" }''',
                           'div' : '''{ } local attrs "id" swap attrs cell+ drop { tag : "div" , content : [ ] , attrs : attrs @ , container : "y" }''',
                           'label' : '''{ } local attrs "for" swap attrs cell+ drop local content { tag : "label" , content : [ content @ ] , attrs : attrs @ , container : "y" }''',
                           'headlink' : '''{ } local attrs "href" swap attrs cell+ drop "rel" "stylesheet" attrs cell+ drop { tag : "link" , content : [ ] , attrs : attrs @ , container : "n" }'''}
        self.help = web_help(self.interpreter.output)
        self.version = 'v1.0.0'

