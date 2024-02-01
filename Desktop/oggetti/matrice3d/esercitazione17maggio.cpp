#include<iostream>
using namespace std;

int main(){

FILE * file;
char bufferlettura[1000];
fopen_s(&file, https:/github.com/programmazione2-simulazione/esercitazione17maggio-glacialfire/blob/1b76aca9d94c79674f7b3ee650f1e77d26cfa582/Punteggi.txt, "r");



return 0;}


/*
class Nodo{
public:
    int valore;
    Nodo * succ;

};

class ListaSempliceOrdinata{
    Nodo *testa;
public:
    ListaSempliceOrdinata(){testa=nullptr;}
    ~ListaSempliceOrdinata();

    Nodo *getTesta(){return testa;}

    //inserimento in testa
    void inserisci(int val);
    void inserisci(Nodo* precedente, Nodo *seguente, int val);
    void inserisci_in_coda(int val);
    Nodo * ricerca(int val);
    void rimuovi(int val);

    friend
    ostream& operator<<(ostream &out, const ListaSempliceOrdinata& ls);
};

    ListaSempliceOrdinata::~ListaSempliceOrdinata(){
        Nodo *iter= this->testa;
        while(iter!=nullptr){
            Nodo *temp= iter->succ;
            delete iter;
            iter = temp;
        }

    }

    ostream& operator<<(ostream &out, const ListaSempliceOrdinata & ls){
        Nodo* iter= ls.testa;
        while(iter!=nullptr){
            out << iter->valore << "--> ";
            iter = iter->succ;
        }
        out << "null" << endl;
        return out;

    }

    void ListaSempliceOrdinata::inserisci(int val){
        Nodo* nuovo = new Nodo;
        nuovo->valore=val;
        Nodo *iter = this->testa;
        if(this->testa==nullptr || this->testa->valore >val){
             nuovo->succ = this->testa;
             this->testa= nuovo; //inserimento in testa

        }
        else{
            while((iter->succ!=nullptr)&&(val> iter->succ->valore)) //il successivo ha un valore maggiore di quello da inserire
                iter= iter->succ; //iter punta al successivo

                nuovo->succ=iter->succ;
                iter->succ=nuovo;

        }

    }


     Nodo* ListaSempliceOrdinata::ricerca(int val){
        Nodo *p;
        for(p=this->testa; p!=nullptr; p=p->succ)
            if(p->valore==val)
            return p;

        return nullptr;
    }




    void ListaSempliceOrdinata::rimuovi(int val){
        Nodo* prec;
        Nodo* current;
        if(this->testa==nullptr)
            cout << "Lista vuota: impossibile rimuovere elemento";
        else if(this->testa->valore==val){
            prec=this->testa;
            this->testa= this->testa->succ;
            delete prec;
        }
        else{
            prec=this->testa;
            current=this->testa->succ; //quello che segue la testa
            while((current!=nullptr) && (current->valore!=val)){
                prec=prec->succ;
                current=current->succ; //sposto avanti nella lista i puntatori
            }
            if(current!=nullptr){
                prec->succ = current->succ;
                delete current;
            }
            else
                cout << "Elemento non presente nella lista" << endl;
        }
    }

*/
