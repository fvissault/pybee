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
        self.dictionary = {
            'generate' : '''    dup "tag" cell@ local tag 
    dup "content" cell@ local content 
    dup "attrs" cell@ local attrs 
    "container" cell@ local container 
    0 local item 
    0 local i 
    0 local k 
    0 local v 
    tag @ "comment" = 
    if 
        "<!--<#0#>-->" [ content @ 0 cell@ ] format .cr 
    else 
        tag @ "html" = 
        if 
            session? invert 
            if 
                htmlcontent 
            then 
            "<!DOCTYPE html>" .cr 
        then 
        "<<#0#>" [ tag @ ] format . 
        attrs @ cells 0 > 
        if 
            attrs @ keys k ! 
            attrs @ values v ! 
            k @ cells i 
            do 
                k @ i @ cell@ v @ i @ cell@ = 
                if 
                    " <#0#>" [ k @ i @ cell@ ] format . 
                else 
                    " <#0#>='<#1#>'" [ k @ i @ cell@ v @ i @ cell@ ] format . 
                then 
            loop 
        then 
        container @ "y" = 
        if 
            ">" . 
            0 i ! 
            content @ cells i 
            do 
                content @ i @ cell@ item ! 
                item @ ?str 
                if 
                    item @ . 
                else 
                    item @ generate 
                then 
            loop 
        else 
            "/>" .cr 
        then 
        container @ "y" = 
        if 
            "</<#0#>>" [ tag @ ] format .cr 
        then 
    then''',
            #*********************************
            'webreset' : '''    "html" ?var 
    if 
        forget html 
    then 
    "head" ?var 
    if 
        forget head 
    then 
    "title" ?var 
    if 
        forget title 
    then 
    "body" ?var 
    if 
        forget body 
    then 
    "form1" ?var 
    if 
        forget form1 
    then 
    { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html 
    { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head "UTF-8" charset addcontent 
    head "width=device-width,initial-scale=1.0" "viewport" meta addcontent 
    { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body 
    html head addcontent 
    html body addcontent 
    { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title 
    head title addcontent 
    { tag : "form" , content : [ ] , attrs : { action : "" , method : "post" } , container : "y" } var form1 
    cls''',
            #*********************************
            'addcontent' : '''    local toadd 
    local where 
    toadd @ ?array invert 
    if 
        toadd @ ?var toadd @ ?local or 
        if 
            toadd @ @ toadd ! 
        then 
    then 
    "content" toadd @ where @ cell+ drop''',
            #*********************************
            'addattr' : '''    local valueattr 
    local nameattr 
    local contattrs 
    nameattr @ valueattr @ contattrs @ "attrs" cell@ cell+ drop''',
            #*********************************
            'fieldarea' : '''    { } local attrs 
    local fatype 
    local favalue 
    local faid 
    "type" fatype @ attrs cell+ drop favalue @ "" <> 
    if 
        "value" favalue @ attrs cell+ drop 
    then 
    faid @ "" <> 
    if 
        "id" faid @ attrs cell+ drop 
        "name" faid @ attrs cell+ drop 
    then 
    { tag : "input" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'div' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "div" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'label' : '''    { } local attrs 
    "for" swap attrs cell+ drop 
    local content 
    { tag : "label" , content : [ content @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'headlink' : '''    { } local attrs 
    "href" swap attrs cell+ drop 
    "rel" "stylesheet" attrs cell+ drop 
    { tag : "link" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'headscriptfile' : '''    local src 
    local mode 
    { } local attrs 
    "src" src @ attrs cell+ drop 
    mode @ "defer" = 
    if 
        "defer" mode @ attrs cell+ drop 
    then 
    mode @ "async" = 
    if 
        "async" mode @ attrs cell+ drop 
    then 
    { tag : "script" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'script': '''    local cont 
    local mode 
    { } local attrs 
    mode @ "defer" = 
    if 
        "defer" mode @ attrs cell+ drop 
    then 
    mode @ "async" = 
    if 
        "async" mode @ attrs cell+ drop 
    then 
    { tag : "script" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'img' : '''    { } local attrs 
    "src" swap attrs cell+ drop 
    { tag : "img" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'textarea' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "textarea" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'br' : '''    { tag : "br" , content : [ ] , attrs : [ ] , container : "n" }''',
            #*********************************
            'select' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "select" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'option' : '''    { } local attrs 
    dup "y" = 
    if 
        "selected" swap attrs cell+ drop 
    then 
    "value" swap attrs cell+ drop 
    local cont 
    { tag : "option" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'a' : '''    local href 
    local cont 
    { } local attrs 
    "href" href @ attrs cell+ drop 
    { tag : "a" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'button' : '''    { } local attrs 
    local buttontype 
    local cont 
    "type" buttontype @ attrs cell+ drop 
    { tag : "button" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'header' : '''    { tag : "header" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'footer' : '''    { tag : "footer" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'article' : '''    { tag : "article" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'style' : '''    local cont 
    { tag : "style" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'paragraph' : '''    local cont 
    { tag : "p" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'maintitle' : '''    local cont 
    local size 
    { tag : "h<#0#>" [ size @ ] format , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'span' : '''    local cont 
    { tag : "span" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'strong' : '''    local cont 
    { tag : "strong" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'small' : '''    local cont 
    { tag : "small" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'underline' : '''    local cont 
    { tag : "u" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'table' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "table" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'th' : '''    local tableid 
    local colnum 
    local properties 
    properties @ 0 cell@ local cont 
    properties @ 1 cell@ local scope 
    properties @ 2 cell@ local filter 
    properties @ 3 cell@ local sort 
    properties @ cells 6 = 
    if 
        properties @ 4 cell@ local rowspan 
        properties @ 5 cell@ local colspan 
    then 
    { } local attrs 
    scope @ "col" = scope @ "row" = or 
    if 
        "scope" scope @ attrs cell+ drop 
    then 
    properties @ cells 6 = 
    if 
        rowspan @ 1 > 
        if 
            "rowspan" rowspan @ attrs cell+ drop 
        then 
        colspan @ 1 > 
        if 
            "colspan" colspan @ attrs cell+ drop 
        then 
    then 
    { tag : "th" , content : [ cont @ ] , attrs : attrs @ , container : "y" } local tag 
    tag "class" "tablehead" addattr 
    sort @ "sort" = 
    if 
        "userarea/img/sort-solid-full.svg" img local sortimage 
        sortimage "width" 16 addattr 
        sortimage "onclick" "sort(\"<#0#>\", this, <#1#>)" [ tableid @ colnum @ ] format addattr 
        sortimage "style" "vertical-align:middle;" addattr 
        tag sortimage @ addcontent 
    then 
    filter @ "filter" = 
    if 
        tag br addcontent 
        "mytablef<#0#>" [ colnum @ ] format "" "text" fieldarea local fa 
        fa "class" "filterinput" addattr 
        fa "onkeyup" "filter(\"<#0#>\", this, <#1#>)" [ tableid @ colnum @ ] format addattr 
        fa "placeholder" "Filter..." addattr 
        tag fa @ addcontent 
    then 
    tag @''',
            #*********************************
            'td' : '''    local properties 
    properties @ 0 cell@ local cont 
    properties @ cells 3 = 
    if 
        properties @ 1 cell@ local rowspan 
        properties @ 2 cell@ local colspan 
    then 
    { } local attrs 
    properties @ cells 3 = 
    if 
        rowspan @ 1 > 
        if 
            "rowspan" rowspan @ attrs cell+ drop 
        then 
        colspan @ 1 > 
        if 
            "colspan" colspan @ attrs cell+ drop 
        then 
    then 
    { tag : "td" , content : [ cont @ ] , attrs : attrs @ , container : "y" } local cell 
    cell "class" "tablecell" addattr 
    cell @''',
            #*********************************
            'row' : '''    local properties 
    local container 
    container @ "attrs" cell@ "id" cell@ local tableid 
    0 local i 
    0 local item 
    tablerow local tr 
    properties @ cells i 
    do 
        properties @ i @ cell@ item ! 
        item @ cells 4 = item @ cells 6 = or 
        if 
            tr item @ i @ tableid @ th addcontent 
        else 
            tr item @ td addcontent 
        then 
    loop 
    container @ tr @ addcontent''',
            #*********************************
            'tablerow' : '''    { tag : "tr" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'tablecell' : '''    local cont 
    { tag : "td" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'tablehead' : '''    local cont 
    { tag : "th" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'unorderlist' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "ul" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'orderlist' : '''    { } local attrs 
    "id" swap attrs cell+ drop 
    { tag : "ol" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'listitem' : '''    local cont 
    { tag : "li" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'urlbase' : '''    { } local attrs 
    "target" rot attrs cell+ drop 
    "href" rot attrs cell+ drop 
    { tag : "base" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'charset' : '''
    local charset 
    { } local attrs 
    "charset" charset @ attrs cell+ drop 
    { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'httpequiv' : '''    local content 
    local httpequiv 
    { } local attrs 
    "http-equiv" httpequiv @ attrs cell+ drop 
    "content" content @ attrs cell+ drop 
    { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'meta' : '''    { } local attrs 
    local name 
    local content 
    "name" name @ attrs cell+ drop 
    "content" content @ attrs cell+ drop 
    { tag : "meta" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'comment' : '''    local cont 
    { tag : "comment" , content : [ cont @ ] , attrs : { } , container : "n" }''',
            #*********************************
            'abbr': '''    local title 
    local cont 
    { } local attrs 
    "title" title @ attrs cell+ drop 
    { tag : "abbr" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'address': '''    { tag : "address" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'area': '''    local href 
    local coords 
    local shape 
    { } local attrs 
    "shape" shape @ attrs cell+ drop 
    "coords" coords @ attrs cell+ drop 
    "href" href @ attrs cell+ drop 
    { tag : "area" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'map': '''    local name 
    { } local attrs 
    "name" name @ attrs cell+ drop 
    { tag : "map" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'aside': '''    { tag : "aside" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'audio': '''    local muted 
    local inloop 
    local autoplay 
    local controls 
    { } local attrs 
    controls @ "controls" = 
    if 
        "controls" controls @ attrs cell+ drop 
    then 
    autoplay @ "autoplay" = 
    if 
        "autoplay" autoplay @ attrs cell+ drop 
    then 
    inloop @ "loop" = 
    if 
        "loop" inloop @ attrs cell+ drop 
    then 
    muted @ "muted" = 
    if 
        "muted" muted @ attrs cell+ drop 
    then 
    { tag : "audio" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'source': '''    local sourcetype 
    local src 
    { } local attrs 
    "src" src @ attrs cell+ drop 
    "type" sourcetype @ attrs cell+ drop 
    { tag : "source" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'pictsrc': '''    local srcset 
    local media 
    { } local attrs 
    "media" media @ attrs cell+ drop 
    "scset" srcset @ attrs cell+ drop 
    { tag : "source" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'bold': '''    local cont 
    { tag : "b" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'bdo': '''    local dir 
    local cont 
    { } local attrs 
    "dir" dir @ attrs cell+ drop 
    { tag : "bdo" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'blockquote': '''    local cont 
    { tag : "blockquote" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'canvas': '''    local id 
    { } local attrs 
    "id" id @ attrs cell+ drop 
    { tag : "canvas" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'caption': '''    local cont 
    { tag : "caption" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'cite': '''    local cont 
    { tag : "cite" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'code': '''    local cont 
    { tag : "code" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'col': '''    local colspan 
    { } local attrs 
    colspan @ 1 > 
    if 
        "span" colspan @ attrs cell+ drop 
    then 
    { tag : "col" , content : [ ] , attrs : attrs @ , container : "n" }''',
            #*********************************
            'colgroup': '''    { tag : "colgroup" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'data': '''    local value 
    local cont 
    { } local attrs 
    "value" value @ attrs cell+ drop 
    { tag : "data" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'datalist': '''    local id 
    { } local attrs 
    "id" id @ attrs cell+ drop 
    { tag : "datalist" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'dloption': '''    local value 
    { } local attrs 
    "value" value @ attrs cell+ drop 
    { tag : "option" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'dl': '''    { tag : "dl" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'dt': '''    local cont 
    { tag : "dt" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'dd': '''    local cont 
    { tag : "dd" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'del': '''    local cont 
    { tag : "del" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'details': '''    local cont 
    local open 
    { } local attrs 
    open @ "open" = 
    if 
        "open" open @ attrs cell+ drop 
    then 
    { tag : "details" , content : [ { tag : "summary" , content : [ cont @ ], attrs : { }, container : "y" } ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'dfn': '''    local cont 
    { tag : "dfn" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'dialog': '''    local open 
    local cont 
    { } local attrs 
    open @ "open" = 
    if 
        "open" open @ attrs cell+ drop 
    then 
    { tag : "dialog" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'em': '''    local cont 
    { tag : "em" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'fieldset': '''    local disabled 
    local name 
    { } local attrs 
    disabled @ "disabled" = 
    if 
        "disabled" disabled @ attrs cell+ drop 
    then 
    "name" name @ attrs cell+ drop 
    { tag : "fieldset" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'figcaption': '''    local cont 
    { tag : "figcaption" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'figure': '''    { tag : "figure" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'form': '''    local method 
    local action 
    { } local attrs 
    "action" action @ attrs cell+ drop 
    "method" method @ attrs cell+ drop 
    { tag : "form" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'hr': '''    { tag : "hr" , content : [ ] , attrs : { } , container : "n" }''',
            #*********************************
            'italic': '''    local cont 
    { tag : "i" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'iframe': '''    local src 
    { } local attrs 
    "src" src @ attrs cell+ drop 
    { tag : "iframe" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'ins': '''    local cont 
    { tag : "ins" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'kbd': '''    local cont 
    { tag : "kbd" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'legend': '''    local cont 
    { tag : "legend" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'main': '''    { tag : "main" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'mark': '''    local cont 
    { tag : "mark" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'menu': '''    { tag : "menu" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'meter': '''    local id 
    local value 
    local min 
    local max 
    local cont 
    { } local attrs 
    max @ 0= invert 
    if 
        "max" max @ attrs cell+ drop 
    then 
    min @ 0= invert 
    if 
        "min" min @ attrs cell+ drop 
    then 
    "value" value @ attrs cell+ drop 
    "id" id @ attrs cell+ drop 
    { tag : "meter" , content : [ cont @ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'nav': '''    { tag : "nav" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'noscript': '''    local cont 
    { tag : "noscript" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'optgroup': '''    local label 
    local disabled 
    { } local attrs 
    disabled @ "disabled" = 
    if 
        "disabled" disabled @ attrs cell+ drop 
    then 
    "label" label @ attrs cell+ drop 
    { tag : "optgroup" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'picture': '''    { tag : "picture" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'pre': '''    local cont 
    { tag : "pre" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'quote': '''    local cont 
    { tag : "q" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'section': '''    { tag : "section" , content : [ ] , attrs : { } , container : "y" }''',
            #*********************************
            'sub': '''    local cont 
    { tag : "sub" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'summary': '''    local cont 
    { tag : "summary" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'sup': '''    local cont 
    { tag : "sup" , content : [ cont @ ] , attrs : { } , container : "y" }''',
            #*********************************
            'video': '''    local muted 
    local inloop 
    local autoplay 
    local controls 
    { } local attrs 
    controls @ "controls" = 
    if 
        "controls" controls @ attrs cell+ drop 
    then 
    autoplay @ "autoplay" = 
    if 
        "autoplay" autoplay @ attrs cell+ drop 
    then 
    inloop @ "loop" = 
    if 
        "loop" inloop @ attrs cell+ drop 
    then 
    muted @ "muted" = 
    if 
        "muted" muted @ attrs cell+ drop 
    then 
    { tag : "video" , content : [ ] , attrs : attrs @ , container : "y" }''',
            #*********************************
            'layoutgrid' : '''    local content 
    local type 
    "laystyle" ?var 
    if 
        type @ "other" = invert 
        if 
            laystyle "#parentlayout { grid-<#0#>: <#1#>; }" [ type @ content @ ] format addcontent 
        else 
            laystyle "#parentlayout { <#0#>; }" [ content @ ] format addcontent 
        then 
    then''',
            #*********************************
            'layoutarea' : '''    local content 
    local areanum 
    local type 
    "laystyle" ?var 
    if 
        type @ "other" = invert 
        if 
            laystyle "#z<#0#> { grid-area: <#1#>; }" [ areanum @ content @ ] format addcontent 
        else 
            laystyle "#z<#0#> { <#1#>; }" [ areanum @ content @ ] format addcontent 
        then 
    then''',
            #*********************************
            'layout' : '''    local zonecount 
    var pagename 
    0 local i 
    "html" ?var 
    if 
        forget html 
    then 
    "head" ?var 
    if 
        forget head 
    then 
    "title" ?var 
    if 
        forget title 
    then 
    "body" ?var 
    if 
        forget body 
    then 
    { tag : "html" , content : [ ] , attrs : { lang : "fr" } , container : "y" } var html 
    { tag : "head" , content : [ ] , attrs : { } , container : "y" } var head "UTF-8" charset addcontent 
    head "width=device-width,initial-scale=1.0" "viewport" meta addcontent 
    { tag : "body" , content : [ ] , attrs : { } , container : "y" } var body 
    "parentlayout" div local container 
    zonecount @ i 
    do 
        "z<#0#>" [ i @ ] format div "var z<#0#>" [ i @ ] format evaluate 
        container @ "z<#0#>" [ i @ ] format addcontent 
    loop 
    body container @ addcontent 
    "#parentlayout { display: grid; }" style var laystyle 
    html head addcontent 
    html body addcontent 
    { tag : "title" , content : [ ] , attrs : { } , container : "y" } var title 
    head title addcontent 
    cls''',
            #*********************************
            'savelaystyle' : '''    local where 
    where @ "inline" = 
    if 
        head laystyle addcontent 
    else 
        head "userarea/css/<#0#>.css" [ pagename @ ] format headlink addcontent 
        "cssfile" "css/<#0#>.css" [ pagename @ ] format overwritetofile 
        laystyle "content" cell@ 0 cell@ "cssfile" writein 
        "cssfile" closefile 
    then''',
            #*********************************
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
            #*********************************
            'completeselect' : '''    select local tempselect 
    0 local i 
    0 local item 
    0 local opt 
    dup cells i 
    do 
        dup i @ cell@ item ! 
        item @ 0 cell@ item @ 1 cell@ item @ 2 cell@ option opt ! 
        "content" opt @ tempselect cell+ drop 
    loop 
    tempselect @''',
            #*********************************
            'card' : '''    local name 
    local container 
    "card<#0#>" [ name @ ] format local newname 
    name @ div "var <#0#>" [ newname @ ] format evaluate drop
    newname @ "class" "simple-card" addattr 
    container @ newname @ addcontent''',
            #*********************************
            'addcardtitle' : '''    local content 
    local container 
    "title<#0#>" [ container @ ] format div local titlecontainer 
    titlecontainer "class" "simple-card-title" addattr 
    titlecontainer content @ addcontent 
    container @ titlecontainer addcontent''',
            #*********************************
            'addcardbody' : '''    local content 
    local container 
    "body<#0#>" [ container @ ] format div local bodycontainer 
    bodycontainer "class" "simple-card-body" addattr 
    bodycontainer content @ addcontent 
    container @ bodycontainer addcontent''',
            #*********************************
            'addcardbottom' : '''    local content 
    local container 
    "bottom<#0#>" [ container @ ] format div local bottomcontainer 
    bottomcontainer "class" "simple-card-bottom" addattr 
    bottomcontainer content @ addcontent 
    container @ bottomcontainer addcontent''',
            #*********************************
            'flipcard' : '''    local name 
    local container 
    name @ div local flipcard 
    flipcard "class" "flip-card" addattr 
    flipcard "fci<#0#>" [ name @ ] format div local cardinner cardinner @ addcontent 
    cardinner "class" "flip-card-inner" addattr 
    cardinner "fcf<#0#>" [ name @ ] format div "var fcf<#0#>" [ name @ ] format evaluate @ addcontent 
    "fcf<#0#>" [ name @ ] format "class" "flip-card-front" addattr 
    cardinner "fcb<#0#>" [ name @ ] format div "var fcb<#0#>" [ name @ ] format evaluate @ addcontent 
    "fcb<#0#>" [ name @ ] format "class" "flip-card-back" addattr 
    container @ flipcard @ addcontent''',
            #*********************************
            'profilecard' : '''    local name 
    "profile<#0#>" [ name @ ] format local newname 
    name @ div "var <#0#>" [ newname @ ] format evaluate drop
    newname @ "class" "profile-card" addattr 
    newname @''',
            #*********************************
            'productcard' : '''    local name 
    "product<#0#>" [ name @ ] format local newname 
    name @ div "var <#0#>" [ newname @ ] format evaluate drop
    newname @ "class" "product-card" addattr 
    newname @''',
            #*********************************
            'splitter' : '''    local direction 
    local name 
    local container 
    direction @ "vertical" = direction @ "horizontal" = or 
    if 
        direction @ "vertical" = 
        if 
            "<#0#>left" [ name @ ] format local firstid 
            "<#0#>right" [ name @ ] format local secondid 
        else 
            "<#0#>top" [ name @ ] format local firstid 
            "<#0#>bottom" [ name @ ] format local secondid 
        then 
        "<#0#>divider" [ name @ ] format local dividerid 
        firstid @ div "var <#0#>" [ firstid @ ] format evaluate drop 
        direction @ "vertical" = 
        if 
            firstid @ "class" "splitleft" addattr 
        else 
            firstid @ "class" "splittop" addattr 
        then 
        secondid @ div "var <#0#>" [ secondid @ ] format evaluate drop  
        direction @ "vertical" = 
        if 
            secondid @ "class" "splitright" addattr 
        else 
            secondid @ "class" "splitbottom" addattr 
        then 
        dividerid @ div "var <#0#>" [ dividerid @ ] format evaluate drop  
        direction @ "vertical" = 
        if 
            dividerid @ "class" "splitverticaldivider" addattr 
        else 
            dividerid @ "class" "splithorizontaldivider" addattr 
        then 
        container @ firstid @ addcontent 
        container @ dividerid @ addcontent 
        container @ secondid @ addcontent 
        direction @ "vertical" = 
        if 
            container @ "defer" "const <#0#>=new Splitter(\"<#1#>\",\"<#2#>\",\"vertical\");" [ name @ dividerid @ firstid @ ] format script addcontent 
        else 
            container @ "defer" "const <#0#>=new Splitter(\"<#1#>\",\"<#2#>\",\"horizontal\");" [ name @ dividerid @ firstid @ ] format script addcontent 
        then 
    else 
        container @ "Bad direction for your splitter : only vertical or hoizontal allowed" addcontent 
    then''',
            #*********************************
            'divider' : '''    local type 
    local name 
    local container 
    type @ "double" = type @ "dashed" = or type @ "dotted" = or type @ "solid" = or type @ "rounded" = or 
    if 
        "<#0#>divider" [ name @ ] format local dividername 
        hr "var <#0#>" [ dividername @ ] format evaluate drop 
        dividername @ "class" "<#0#>-divider" [ type @ ] format addattr 
        container @ dividername @ addcontent 
    then''',
            #*********************************
            'overlay' : '''    local name 
    "<#0#>overlay" [ name @ ] format local overlayname 
    name @ div "var <#0#>" [ overlayname @ ] format evaluate drop 
    overlayname @ "class" "overlay" addattr 
    body overlayname @ addcontent''',
            #*********************************
            'tab' : '''    local dir 
    local name 
    local defaultopen 
    local buttontab 
    local container 
    dir @ "top" = dir @ "left" = or 
    if 
        name @ div local buttondiv 
        buttondiv "class" "<#0#>tab" [ dir @ ] format addattr 
        0 local i 
        0 local value 
        0 local color 
        0 local item 
        buttontab @ cells i 
        do 
            "<#0#>tab<#1#>" [ name @ i @ ] format local buttonid 
            buttontab @ i @ cell@ item ! 
            item @ 0 cell@ value ! 
            item @ 1 cell@ color ! 
            value @ "button" button local bouton 
            i @ defaultopen @ = 
            if 
                "<#0#>tablinks defaultOpen" [ dir @ ] format local boutonclass 
            else 
                "<#0#>tablinks" [ dir @ ] format local boutonclass 
            then 
            bouton "class" boutonclass @ addattr 
            bouton "onclick" "openTab(event,\"<#0#>\",this,\"<#1#>\",\"<#2#>\")" [ buttonid @ color @ dir @ ] format addattr 
            buttondiv @ bouton @ addcontent 
        loop 
        container @ buttondiv @ addcontent 
        0 local tabid 
        0 i ! 
        buttontab @ cells i 
        do 
            "<#0#>tab<#1#>" [ name @ i @ ] format tabid ! 
            tabid @ div "var <#0#>" [ tabid @ ] format evaluate drop 
            tabid "class" "<#0#>tabcontent" [ dir @ ] format addattr 
            container @ tabid @ addcontent 
        loop 
        container "onload" "showDefault()" addattr 
    else 
        container @ "Bad direction for your tab : only top or left allowed" addcontent 
    then''',
            #*********************************
            'accordion' : '''    local name 
    local sections 
    local container 
    0 local i 
    0 local panelname 
    0 local item 
    0 local bouton 
    sections @ cells i 
    do 
        sections @ i @ cell@ item ! 
        item @ "button" button bouton ! 
        bouton "class" "accordion" addattr 
        container @ bouton @ addcontent 
        "<#0#>panel<#1#>" [ name @ i @ ] format panelname ! 
        panelname @ div "var <#0#>" [ panelname @ ] format evaluate drop
        panelname @ "class" "panel" addattr 
        container @ panelname @ addcontent 
    loop''',
            #*********************************
            'sidenav' : '''    local name 
    local sntype 
    local links 
    local container 
    sntype @ "push" = sntype @ "overlay" = or 
    if 
        "<#0#>sidenav" [ name @ ] format local snname 
        "sidenav" div "var <#0#>" [ snname @ ] format evaluate drop 
        snname @ "class" "sidenav" addattr 
        container @ snname @ addcontent 
        "&times;" "#" a local closebtn 
        closebtn @ "id" "closebtn" addattr 
        closebtn @ "class" "closebtn" addattr 
        sntype @ "push" = 
        if 
            closebtn @ "onclick" "closeNavPush()" addattr 
        else 
            closebtn @ "onclick" "closeNavOverlay()" addattr 
        then 
        snname @ closebtn @ addcontent 
        "&#9776;" "#" a local openbtn 
        openbtn @ "id" "openbtn" addattr 
        openbtn @ "class" "openbtn" addattr 
        sntype @ "push" = 
        if 
            openbtn @ "onclick" "openNavPush()" addattr 
        else 
            openbtn @ "onclick" "openNavOverlay()" addattr 
        then 
        snname @ openbtn @ addcontent 
        0 local i 
        0 local item 
        0 local content 
        0 local href 
        0 local link 
        links @ cells i 
        do 
            links @ i @ cell@ item ! 
            item @ 1 cell@ content ! 
            item @ 0 cell@ href ! 
            content @ href @ a link ! 
            link "onclick" "openLink(event)" addattr 
            link "class" "navlink" addattr 
            snname @ link @ addcontent 
        loop 
        "<#0#>main" [ name @ ] format local snmain 
        "main" div "var <#0#>" [ snmain @ ] format evaluate drop 
        container @ snmain @ addcontent 
    else 
        container @ "Bad type for your sidenav : only push or overlay allowed" addcontent 
    then''',
            #*********************************
            'topnav' : '''    local name 
    local defaultopen 
    local tntype 
    local links 
    local container 
    "topnav" local tnclass 
    tntype @ "fixed" = 
    if 
        "topnavfixed" tnclass ! 
    then 
    "<#0#>topnav" [ name @ ] format local tnname 
    tnname @ div "var <#0#>" [ tnname @ ] format evaluate drop 
    tnname @ "class" tnclass @ addattr 
    0 local item 
    0 local content 
    0 local href 
    0 local link 
    0 local i 
    links @ cells i 
    do 
        links @ i @ cell@ item ! 
        item @ 1 cell@ content ! 
        item @ 0 cell@ href ! 
        content @ href @ a link ! 
        defaultopen @ i @ = 
        if 
            link "class" "navlink defaultOpen" addattr 
        else 
            link "class" "navlink" addattr 
        then 
        link "onclick" "openLink(event)" addattr 
        tnname @ link @ addcontent 
    loop 
    container @ tnname @ addcontent 
    container @ "onload" "showDefault()" addattr''',
            #*********************************
            'filteredlist' : '''    local name 
    local itemlist 
    local container 
    name @ unorderlist local ulist 
    ulist "class" "unorderedlist" addattr 
    0 local i 
    itemlist @ cells i 
    do 
        ulist itemlist @ i @ cell@ listitem addcontent 
    loop 
    "<#0#>_filter" [ name @ ] format "" "text" fieldarea local fa 
    fa "class" "filterinput" addattr 
    fa "placeholder" "Filter..." addattr 
    fa "onkeyup" "listfilter(\"<#0#>\", this);" [ name @ ] format addattr 
    container @ fa @ addcontent 
    container @ ulist @ addcontent''',
            #*********************************
            'modal' : '''    local name 
    local title 
    local btncontent 
    local container 
    btncontent @ "nobutton" <> 
    if 
        btncontent @ "button" button local btn 
        btn "onclick" "openmodal(\"<#0#>\", this)" [ name @ ] format addattr 
        container @ btn @ addcontent 
    then 
    name @ div local modtemp 
    modtemp "class" "modal" addattr 
    "<#0#>content" [ name @ ] format local modcontentname 
    modcontentname @ div "var <#0#>" [ modcontentname @ ] format evaluate drop 
    modcontentname @ "class" "modalcontent" addattr 
    modtemp modcontentname @ addcontent 
    "<#0#>title" [ name @ ] format div local modtitle 
    modcontentname @ modtitle @ addcontent 
    title @ span local spantitle 
    spantitle "class" "modaltitle" addattr 
    modtitle spantitle @ addcontent 
    "&nbsp;&times;&nbsp;" span local modclose 
    modclose "class" "modalclose" addattr 
    modclose "id" "<#0#>close" [ name @ ] format addattr 
    modtitle modclose @ addcontent 
    container @ modtemp @ addcontent''',
            #*********************************
            'advancebutton' : '''    local name 
    local content 
    local type 
    local look 
    local container 
    0 local btnclass 
    look @ "fullsuccess" = look @ "fullinfo" = or look @ "fullwarning" = or look @ "fulldanger" = or look @ "fulldefault" = or local fullbtn look @ "outlinesuccess" = look @ "outlineinfo" = or look @ "outlinewarning" = or look @ "outlinedanger" = or look @ "outlinedefault" = or local outlinebtn fullbtn @ outlinebtn @ or 
    if 
        type @ "button" = type @ "reset" = or type @ "submit" = or 
        if 
            fullbtn @ 
            if 
                "<#0#> <#1#>" [ "fullbtn" look @ ] format btnclass ! 
            then 
            outlinebtn @ 
            if 
                "<#0#> <#1#>" [ "outlinebtn" look @ ] format btnclass ! 
            then 
            content @ type @ button "var <#0#>" [ name @ ] format evaluate drop 
            name @ "class" btnclass @ addattr 
            name @ "id" name @ addattr 
            container @ name @ @ addcontent 
        else 
            container @ "Bad type for your button : only button, reset, submit are allowed" addcontent 
        then 
    else 
        container @ "Bad look for your button : only fullsuccess, fullinfo, fullwarning, fulldanger, fulldefault, outlinesuccess, outlineinfo, outlinewarning, outlinedanger, outlinedefault are allowed" addcontent 
    then''',
            #*********************************
            'loginform' : '''    local passlostaction 
    local formaction 
    local container 
    load translations/loginform 
    formaction @ "post" form local formulaire 
    formulaire "id" "loginform" addattr 
    "container" div local contdiv 
    contdiv "class" "container" addattr 
    contdiv 2 "identification" _loginform maintitle addcontent 
    contdiv "email" _loginform bold "email" label addcontent 
    "email" "" "email" fieldarea local emailtf 
    emailtf "placeholder" "enteremail" _loginform addattr 
    emailtf "required" "required" addattr 
    contdiv emailtf @ addcontent 
    contdiv "password" _loginform bold "password" label addcontent 
    "password" "" "password" fieldarea local passtf 
    passtf "placeholder" "enterpassword" _loginform addattr 
    passtf "required" "required" addattr 
    contdiv passtf @ addcontent 
    contdiv 3 "login" _loginform maintitle "submit" button addcontent 
    "rememberme" "" "checkbox" fieldarea local remembercb 
    remembercb "checked" "checked" addattr 
    contdiv remembercb @ addcontent 
    contdiv "rememberme" _loginform addcontent 
    "forgot" _loginform span local spanzone 
    spanzone "class" "psw" addattr 
    spanzone "pass?" _loginform passlostaction @ a addcontent 
    contdiv spanzone @ addcontent 
    formulaire contdiv @ addcontent 
    container @ formulaire @ addcontent''',
            #*********************************
            'signupform' : '''    local t&p 
    local action 
    local container 
    load translations/signupform 
    action @ "post" form local formulaire 
    formulaire "id" "signupform" addattr 
    formulaire "class" "signupform" addattr 
    formulaire "data-msg-passwordmismatch" "passwordmismatch" _signup addattr "container" div local contdiv 
    contdiv "class" "container" addattr 
    contdiv 1 "Signup" maintitle addcontent 
    contdiv "recommend" _signup paragraph addcontent 
    contdiv hr addcontent 
    contdiv "firstname" _signup bold "firstname" label addcontent 
    "firstname" "" "text" fieldarea local firstname 
    firstname "placeholder" "enterfn" _signup addattr 
    firstname "required" "required" addattr 
    contdiv firstname @ addcontent 
    contdiv "lastname" _signup bold "lastname" label addcontent 
    "lastname" "" "text" fieldarea local lastname 
    lastname "placeholder" "enterln" _signup addattr 
    lastname "required" "required" addattr 
    contdiv lastname @ addcontent 
    contdiv hr addcontent 
    contdiv "email" _signup bold "email" label addcontent 
    "email" "" "email" fieldarea local emailtf 
    emailtf "placeholder" "enteremail" _signup addattr 
    emailtf "required" "required" addattr 
    contdiv emailtf @ addcontent 
    contdiv "password" _signup bold "password" label addcontent 
    "password" "" "password" fieldarea local passtf 
    passtf "placeholder" "enterpassword" _signup addattr 
    passtf "required" "required" addattr 
    contdiv passtf @ addcontent 
    contdiv "repeat" _signup bold "repeat" label addcontent 
    "repeat" "" "password" fieldarea local repeattf 
    repeattf "placeholder" "repeat" _signup addattr 
    repeattf "required" "required" addattr 
    contdiv repeattf @ addcontent 
    "rememberme" "" "checkbox" fieldarea local remembercb 
    remembercb "checked" "checked" addattr 
    contdiv remembercb @ addcontent 
    contdiv "rememberme" _signup addcontent "agree" _signup paragraph local agree 
    agree "tandp" _signup t&p @ a addcontent 
    contdiv agree @ addcontent 
    contdiv 3 "signup" _signup maintitle "submit" button addcontent 
    formulaire contdiv @ addcontent 
    container @ formulaire @ addcontent'''
        }
        self.help = web_help(self.interpreter.output)
        self.sessionvars = {'session_duration':30}
        self.usecookies = False
        self.version = 'v1.3.5'
        self.packuse = ['mysqldb', 'mail']

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