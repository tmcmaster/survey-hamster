#!/bin/bash

awk -F"," '
BEGIN{
  FS=","
  OFS=","
  getline #BEGIN runs before anything else, so grab the first line with the titles right away
  for(i=1;i<=NF;i++)
  names[i] = ($i)
  print "{"
}
{
  printf "  {"
  for(i=1;i<=NF;i++)
  {
    printf "\"%s\":\"%s\"%s",names[i],($i),(i == NF ? "" : ",")
  }
  print "},"
}
END{
  print "  null:{}\n}"  # the last item will have a comma after it;
                        # you need an element without a comma after
                        # you could also repeat the print block from the main loop
                        # without the very last comma;
                        # then itd run on only the last line
}
'
