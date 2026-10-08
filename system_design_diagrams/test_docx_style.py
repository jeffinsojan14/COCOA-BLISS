import docx
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def test():
    doc = docx.Document()
    t = doc.add_table(2, 2)
    c = t.cell(0, 0)
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="2A150D"/>')
    c._tc.get_or_add_tcPr().append(shading_elm)
    doc.save("test_docx.docx")
    print("Success!")

if __name__ == "__main__":
    test()
