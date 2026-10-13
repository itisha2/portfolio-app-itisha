"""Extract a compact JSON view of the SDS ontology for the portfolio explorer."""
# Usage (needs rdflib): python scripts/extract_ontology.py <ontology.ttl> src/data/sdsOntology.json
import json
import sys

from rdflib import BNode, Graph, Namespace, URIRef
from rdflib.collection import Collection
from rdflib.namespace import OWL, RDF, RDFS, SKOS

src, out = sys.argv[1], sys.argv[2]
SDS = Namespace("https://w3id.org/sds-ontology#")
g = Graph()
g.parse(src, format="turtle")


def short(term):
    if isinstance(term, BNode):
        return None
    s = str(term)
    for prefix, ns in [("sds", str(SDS)), ("chebi", "http://purl.obolibrary.org/obo/CHEBI_"),
                       ("oriont", "https://orienting.eu/oriont#"), ("prov", "http://www.w3.org/ns/prov#"),
                       ("xsd", "http://www.w3.org/2001/XMLSchema#"), ("schema", "https://schema.org/"),
                       ("ghs", "https://pubchem.ncbi.nlm.nih.gov/ghs/"), ("owl", str(OWL)), ("rdfs", str(RDFS))]:
        if s.startswith(ns):
            return f"{prefix}:{s[len(ns):]}"
    return s


def expand(node):
    """Named class, or the members of an owl:unionOf blank node."""
    if isinstance(node, URIRef):
        return [short(node)]
    union = g.value(node, OWL.unionOf)
    if union is not None:
        return [short(m) for m in Collection(g, union) if isinstance(m, URIRef)]
    return []


def text(subject, pred):
    v = g.value(subject, pred)
    return str(v) if v is not None else None


classes = {}
for c in g.subjects(RDF.type, OWL.Class):
    if not isinstance(c, URIRef) or not str(c).startswith(str(SDS)):
        continue
    cid = short(c)
    classes[cid] = {
        "id": cid,
        "label": text(c, RDFS.label) or cid.split(":")[1],
        "comment": text(c, RDFS.comment),
        "parents": sorted(p for o in g.objects(c, RDFS.subClassOf) for p in expand(o)),
        "disjointWith": sorted(p for o in g.objects(c, OWL.disjointWith) for p in expand(o)),
        "alignments": sorted({short(o) for pred in (SKOS.exactMatch, SKOS.closeMatch, RDFS.seeAlso, OWL.equivalentClass)
                              for o in g.objects(c, pred) if isinstance(o, URIRef)}),
        "example": text(c, SDS.example),
    }

# owl:AllDisjointClasses / symmetric disjointness
for a, b in g.subject_objects(OWL.disjointWith):
    sa, sb = short(a), short(b)
    if sb in classes and sa and sa not in classes[sb]["disjointWith"]:
        classes[sb]["disjointWith"].append(sa)


def props(kind):
    result = []
    for p in g.subjects(RDF.type, kind):
        if not isinstance(p, URIRef) or not str(p).startswith(str(SDS)):
            continue
        result.append({
            "id": short(p),
            "label": text(p, RDFS.label),
            "comment": text(p, RDFS.comment),
            "domain": sorted(d for o in g.objects(p, RDFS.domain) for d in expand(o)),
            "range": sorted(r for o in g.objects(p, RDFS.range) for r in expand(o)),
            "inverse": short(g.value(p, OWL.inverseOf)) if g.value(p, OWL.inverseOf) is not None else None,
        })
    return sorted(result, key=lambda x: x["id"])


ontology = g.value(predicate=RDF.type, object=OWL.Ontology)
data = {
    "title": text(ontology, URIRef("http://purl.org/dc/terms/title")),
    "version": text(ontology, OWL.versionInfo),
    "stats": {
        "classes": len(classes),
        "objectProperties": len(props(OWL.ObjectProperty)),
        "datatypeProperties": len(props(OWL.DatatypeProperty)),
        "triples": len(g),
    },
    "classes": sorted(classes.values(), key=lambda x: x["id"]),
    "objectProperties": props(OWL.ObjectProperty),
    "datatypeProperties": props(OWL.DatatypeProperty),
}
with open(out, "w") as f:
    json.dump(data, f, indent=1, ensure_ascii=False)
print(json.dumps(data["stats"]), data["title"], data["version"])
roots = [c["id"] for c in data["classes"] if not any(p in classes for p in c["parents"])]
print("roots:", roots)
