// For more information please refer to : www.pagemac.com
 
#include <SoftwareSerial.h>

#define MAX_BITS 100                 // max number of bits 
#define WEIGAND_WAIT_TIME  3000      // time to wait for another weigand pulse.  

SoftwareSerial nodeSerial(5, 4); 

String url="http://10.132.127.212:3000/order?type=tea&deviceID=123&cardID=";
long startMillis = 0;
long stopMillis = 0;
long timeCount = 0;
long volume = 0;

 
unsigned char databits[MAX_BITS];    // stores all of the data bits
unsigned char bitCount;              // number of bits currently captured
unsigned char flagDone;              // goes low when data is currently being captured
unsigned int weigand_counter;        // countdown until we assume there are no more bits 
unsigned long facilityCode=0;        // decoded facility code
unsigned long cardCode=0;            // decoded card code
 

void ISR_INT0(){
  bitCount++;
  flagDone = 0;
  weigand_counter = WEIGAND_WAIT_TIME;  
}
 

void ISR_INT1(){
  databits[bitCount] = 1;
  bitCount++;
  flagDone = 0;
  weigand_counter = WEIGAND_WAIT_TIME;  
}
 
void setup(){
  pinMode(2, INPUT);     // DATA0 (INT0)
  pinMode(3, INPUT);     // DATA1 (INT1)

  nodeSerial.begin(9600);
  
  digitalWrite(4, HIGH);
  attachInterrupt(0, ISR_INT0, FALLING);  
  attachInterrupt(1, ISR_INT1, FALLING);
 
  weigand_counter = WEIGAND_WAIT_TIME;
}
 
void loop(){
  // This waits to make sure that there have been no more data pulses before processing data
  if (!flagDone) {
    if (--weigand_counter == 0)
      flagDone = 1;  
  }
 
  // if we have bits and we the weigand counter went out
  if (bitCount > 0 && flagDone) {
    unsigned char i; 
    if (bitCount == 35){
      for (i=2; i<14; i++){
         facilityCode <<=1;
         facilityCode |= databits[i];
      }
      for (i=14; i<34; i++){
         cardCode <<=1;
         cardCode |= databits[i];
      }
      printBits();
    }
    else if (bitCount == 26){
      for (i=1; i<9; i++){
         facilityCode <<=1;
         facilityCode |= databits[i];
      }
      for (i=9; i<25; i++){
         cardCode <<=1;
         cardCode |= databits[i];
      }
      printBits();  
    }
    else {
     nodeSerial.println("$*"); 
    }
    // cleanup and get ready for the next card
    bitCount = 0;
    facilityCode = 0;
    cardCode = 0;
    for (i=0; i<MAX_BITS; i++){
       databits[i] = 0;
    }
  }
}
 
void printBits(){
      digitalWrite(cardLed, HIGH);
      url.concat(cardCode);
      nodeSerial.println(url);
      url="http://10.132.127.212:3000/order?type=tea&deviceID=123&cardID=";      
}
