class predef_mails:
    def __init__(self):
        self.mail = {}

    def get_named_mail(self, name:str, lang:str, toreplace:dict) -> dict:
        filename = name + '_' + lang + '.txt'
        with open(filename, 'r', encoding='utf8') as file:
            file_content = file.read()
        self.mail = eval(file_content)
        for key, value in toreplace.items():
            self.mail['subject'] = self.mail['subject'].replace('[' + key + ']', value)
            self.mail['body'] = self.mail['body'].replace('[' + key + ']', value)
            self.mail['text'] = self.mail['text'].replace('[' + key + ']', value)
        return self.mail

    def new_predef_mail(self, name:str, lang:str, subject:str, html:str, text:str) -> None:
        new_mail = {'subject': subject, 'html': html, 'text': text}
        filename = name + '_' + lang + '.txt'
        with open(filename, 'w', encoding='utf8') as file:
            file.write(f'{new_mail}')

    def get_subject(self) -> str:
        if 'subject' in self.mail:
            return self.mail['subject']
        else:
            return 'None'

    def get_html_body(self) -> str:
        if 'body' in self.mail:
            return self.mail['body']
        else:
            return 'None'

    def get_text_body(self) -> str:
        if 'text' in self.mail:
            return self.mail['text']
        else:
            return 'None'

'''
pm = predef_mails()
pm.get_named_mail('passlost', 'fr', {'name': 'Fred', 'link':'http://google.com'})
subject = pm.get_subject()
html = pm.get_html_body()
text = pm.get_text_body()
print(subject)
print(html)
print(text)
'''