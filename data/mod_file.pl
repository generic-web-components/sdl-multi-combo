#!/usr/bin/perl

open(IN,"./srch-data.txt");
my $i = 1; 
while (<IN>) {
	if ($_ =~ /_id/i) {
		print "\"_id\": \"$i\",\n"; 
		$i++;
	} else {
		print $_;
	}
}
